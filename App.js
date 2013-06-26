Ext.define('DefectsByEnvironmentApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
         
    launch: function() {
        var dataScope = this.getContext().getDataContext();
        console.log(dataScope);
        Ext.create('Rally.data.WsapiDataStore', {
            model: 'Defect',
            context: dataScope,
            fetch: ['Name', 'OpenedDate', 'Environment'],
            sorters: [
                {
                    property: 'OpenedDate',
                    direction: 'ASC'
                }
            ],
            pageSize: 200,
            limit: Infinity,
            autoLoad: true,
            listeners: {
                load: this._onDataLoaded,
                scope: this
            }
        });
    },

    _createSeries: function(data) {
        var startYear = 2010, startMonth = 7, date, result = [];
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

    _createRatio: function(data) {
        debugger;
        var result = [];
        var prod = _.find(data, { 'name': 'Production' }).data;
        var test = _.find(data, { 'name': 'Test' }).data;
        for (var i = 0; i < prod.length; i++) {
            if (test[i] > 0) {
                result.push(prod[i] / test[i]);
            } else {
                result.push(0);
            }
        }
        return result;
    },

    _onDataLoaded: function(store, data) {
        var env, date, environmentData = {}, environments = [], countData = {}, seriesData = [];
        var me = this;
        Ext.Array.each(data, function(record) {
            date = Ext.Date.format(record.get('OpenedDate'), 'Y-n');
            env = record.get('Environment');
            if(!environmentData[env]) {
                environments.push(env);
                environmentData[env] = [];
            }
            environmentData[env].push({
                Name: record.get('Name'),
                OpenedDate: date
            });
        });

        Ext.Array.each(environments, function(environment) {
            countData[environment] = _.countBy(environmentData[environment], function(record) { return record.OpenedDate; });
            seriesData.push({
                name: environment,
                type: 'column',
                data: me._createSeries(countData[environment]),
                yAxis: 1
            });
        });

        seriesData.push({
            name: 'Ratio',
            type: 'line',
            data: me._createRatio(seriesData),
            yAxis: 2               
        });

        this.add({
            xtype: 'rallychart',
            chartColors: ['#0d233a','#2f7ed8','#8bbc21', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
            chartConfig: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Defects By Environment',
                    style: {
                        color: 'black',
                        font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                    }
                },
                xAxis: {
                    categories: this._dates
                },
                yAxis: [{
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
                }, {
                    min: 0,
                    title: {
                        text: 'Prod / Test Ratio'
                    }
                }],
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
                            color: 'black'
                        }
                    }
                }
            },
            chartData: {
                categories: this._dates,
                series: seriesData
            }
        });
    }
});
