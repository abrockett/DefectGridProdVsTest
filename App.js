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
            pageSize: 200,
            limit: 1000,
            autoLoad: true,
            listeners: {
                load: this._onDataLoaded,
                scope: this
            }
        });
    },

    _createSeries: function(data) {
        var startYear = 2010, startMonth = 1, date, result = [];
        var endYear = new Date().getFullYear(), endMonth = new Date().getMonth() + 1;

        for (var year=startYear; year <= endYear; year++) {
            for (var month = startMonth; month <= 12; month++) {
                date = year + '-' + month;
                if (!data[date]) {
                    result.push(0);
                } else {
                    result.push(data[date]);
                }
                if (year === endYear && month === endMonth) break;
            }
            startMonth = 1;
        }
        return result;
    },

    _onDataLoaded: function(store, data) {
        var env, date, environmentData = {}, environments = [], countData = {}, seriesData = {};
        var me = this;
        Ext.Array.each(data, function(record) {
            date = Ext.Date.format(record.get('CreationDate'), 'Y-n');
            env = record.get('Environment');
            if(!environmentData[env]) {
                environments.push(env);
                environmentData[env] = [];
            }
            environmentData[env].push({
                Name: record.get('Name'),
                CreationDate: date
            });
        });

        Ext.Array.each(environments, function(environment) {
            countData[environment] = _.countBy(environmentData[environment], function(record) { return record.CreationDate; })
            seriesData[environment] = me._createSeries(countData[environment]);
        });

        debugger;
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
