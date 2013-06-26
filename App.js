Ext.define('DefectsByEnvironmentApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
         
    launch: function() {
        var dataScope = this.getContext().getDataContext();
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
        this._dates = [];

        for (var year=startYear; year <= endYear; year++) {
            for (var month = startMonth; month <= 12; month++) {
                date = year + '-' + month;
                if (!data[date]) {
                    result.push(0);
                } else {
                    result.push(data[date]);
                }
                this._dates.push(date);

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
            countData[environment] = _.countBy(environmentData[environment], function(record) { return record.CreationDate; });
            seriesData[environment] = me._createSeries(countData[environment]);
        });
        
        this.add({
            xtype: 'rallychart',
            chartConfig: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Defects By Environment'
                },
                xAxis: {
                    categories: this._dates
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number of Defects'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -100,
                    verticalAlign: 'top',
                    y: 20,
                    floating: true,
                    backgroundColor: 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    formatter: function() {
                        return '<b>'+ this.x +'</b><br/>'+
                            this.series.name +': '+ this.y;
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: 'white'
                        }
                    }
                },
            },
            chartData: {
                categories: this._dates,
                series: [
                    {
                        name: 'Production',
                        data: seriesData['Production']
                    },
                    {
                        name: 'Test',
                        data: seriesData['Test']
                    }
                ]
            }
        });

    }
});
