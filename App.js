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
        var records = [];
        var date;
        Ext.Array.each(data, function(record) {
            //Perform custom actions with the data here

            date = record.get('CreationDate').getFullYear() + ' ' + record.get('CreationDate').getMonth();
            records.push({
                Name: record.get('Name'),
                CreationDate: date
            });
        });
        console.log(records);
        series = _.groupBy(records, function(record) { return record.CreationDate });
        console.log(series);

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
