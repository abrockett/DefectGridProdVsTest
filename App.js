Ext.define('DefectGridApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

            
    launch: function() {
        var dataScope = this.getContext().getDataContext();
        var chart = Ext.create('Rally.ui.chart.Chart', {});
        Ext.create('Rally.data.WsapiDataStore', {
            model: 'Defect',
            context: dataScope,
            fetch: ['Name', 'CreationDate'],
            sorters: [
                {
                    property: 'CreationDate',
                    direction: 'ASC'
                }
            ],
            pageSize: 5,
            limit: 5,
            autoLoad: true,
            listeners: {
                load: this._onDataLoaded,
                scope: this
            }
        });
    },

    _onDataLoaded: function(store, data) {
        debugger;
        var snapshots = [];
        var dateTime;
        Ext.Array.each(data, function(record) {
            //Perform custom actions with the data here

            dateTime = Rally.data.lookback.Lumenize.Time.getISOStringFromJSDate(record.get('CreationDate'))
            snapshots.push({
                Name: record.get('Name'),
                '_ValidFrom': dateTime,
                '_ValidTo': dateTime,
                CreationDate: record.get('CreationDate')
            });
        });

        var metrics = [
            {as: 'DefectCount', f: 'count'}
        ]

        var config = {
            metrics: metrics,
            granularity: Rally.data.lookback.Lumenize.Time.MONTH,
            tz: 'America/Denver'
        };

        var calculator = new Rally.data.lookback.Lumenize.TimeSeriesCalculator(config);

        var startOnISOString = new Rally.data.lookback.Lumenize.Time('2010-01-01').getISOStringInTZ(config.tz);
        var upToDateISOString = new Rally.data.lookback.Lumenize.Time('2013-06-10').getISOStringInTZ(config.tz);
        calculator.addSnapshots(snapshots, startOnISOString, upToDateISOString);

        console.log(calculator.getResults());

        // this.add({
        //     xtype: 'rallygrid',
        //     store: Ext.create('Rally.data.custom.Store', {
        //         data: records,
        //         pageSize: 200
        //     }),
        //     columnCfgs: [
        //         {
        //             text: 'Name', dataIndex: 'Name', flex: 1
        //         },
        //         {
        //             text: 'Created', dataIndex: 'CreationDate', width: 300
        //         }
        //     ]
        // });
    }
});
