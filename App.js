Ext.define('DefectGridApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

            
    launch: function() {
        var dataScope = this.getContext().getDataContext();
        var chart = Ext.create('Rally.ui.chart.Chart', {});
        Ext.create('Rally.data.WsapiDataStore', {
            model: 'Defect',
            context: dataScope,
            fetch: ['Name', 'CreationDate', 'Environment'],
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
        var env, date, seriesData = {};
        Ext.Array.each(data, function(record) {
            date = Ext.Date.format(record.get('CreationDate'), 'Y-m');
            env = record.get('Environment');
            if(!seriesData[env]) {
                seriesData[env] = [];
            }
            seriesData[env].push({
                Name: record.get('Name'),
                CreationDate: date
            });
        });

        // var prodSeries = _.countBy(prodDefects, function(record) { return record.CreationDate; });
        // var testSeries = _.countBy(testDefects, function(record) { return record.CreationDate; });
        // var otherSeries = _.countBy(otherDefects, function(record) { return record.CreationDate; });

        console.log(seriesData);

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
