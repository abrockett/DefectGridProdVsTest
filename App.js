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
                data: me._createSeries(countData[environment])
            });
        });
        
        this.add({
            xtype: 'rallychart',
            chartColors: [
               '#2f7ed8', 
               '#0d233a', 
               '#8bbc21', 
               '#910000', 
               '#1aadce', 
               '#492970',
               '#f28f43', 
               '#77a1e5', 
               '#c42525', 
               '#a6c96a'
            ],
            chartConfig: {
                chart: {
                    type: 'column'
                    // backgroundColor: {
                    //     linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    //     stops: [
                    //         [0, 'rgb(96, 96, 96)'],
                    //         [1, 'rgb(16, 16, 16)']
                    //     ]
                    // }
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

    },

    _makeTheme: function() {
        /**
         * Gray theme for Highcharts JS
         * @author Torstein Hønsi
         */

        Highcharts.theme = {
           colors: ["#DDDF0D", "#7798BF", "#55BF3B", "#DF5353", "#aaeeee", "#ff0066", "#eeaaee",
              "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
           chart: {
              backgroundColor: {
                 linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                 stops: [
                    [0, 'rgb(96, 96, 96)'],
                    [1, 'rgb(16, 16, 16)']
                 ]
              },
              borderWidth: 0,
              borderRadius: 15,
              plotBackgroundColor: null,
              plotShadow: false,
              plotBorderWidth: 0
           },
           title: {
              style: {
                 color: '#FFF',
                 font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
              }
           },
           subtitle: {
              style: {
                 color: '#DDD',
                 font: '12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
              }
           },
           xAxis: {
              gridLineWidth: 0,
              lineColor: '#999',
              tickColor: '#999',
              labels: {
                 style: {
                    color: '#999',
                    fontWeight: 'bold'
                 }
              },
              title: {
                 style: {
                    color: '#AAA',
                    font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                 }
              }
           },
           yAxis: {
              alternateGridColor: null,
              minorTickInterval: null,
              gridLineColor: 'rgba(255, 255, 255, .1)',
              minorGridLineColor: 'rgba(255,255,255,0.07)',
              lineWidth: 0,
              tickWidth: 0,
              labels: {
                 style: {
                    color: '#999',
                    fontWeight: 'bold'
                 }
              },
              title: {
                 style: {
                    color: '#AAA',
                    font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                 }
              }
           },
           legend: {
              itemStyle: {
                 color: '#CCC'
              },
              itemHoverStyle: {
                 color: '#FFF'
              },
              itemHiddenStyle: {
                 color: '#333'
              }
           },
           labels: {
              style: {
                 color: '#CCC'
              }
           },
           tooltip: {
              backgroundColor: {
                 linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                 stops: [
                    [0, 'rgba(96, 96, 96, .8)'],
                    [1, 'rgba(16, 16, 16, .8)']
                 ]
              },
              borderWidth: 0,
              style: {
                 color: '#FFF'
              }
           },


           plotOptions: {
              series: {
                 shadow: true
              },
              line: {
                 dataLabels: {
                    color: '#CCC'
                 },
                 marker: {
                    lineColor: '#333'
                 }
              },
              spline: {
                 marker: {
                    lineColor: '#333'
                 }
              },
              scatter: {
                 marker: {
                    lineColor: '#333'
                 }
              },
              candlestick: {
                 lineColor: 'white'
              }
           },

           toolbar: {
              itemStyle: {
                 color: '#CCC'
              }
           },

           navigation: {
              buttonOptions: {
                 symbolStroke: '#DDDDDD',
                 hoverSymbolStroke: '#FFFFFF',
                 theme: {
                    fill: {
                       linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                       stops: [
                          [0.4, '#606060'],
                          [0.6, '#333333']
                       ]
                    },
                    stroke: '#000000'
                 }
              }
           },

           // scroll charts
           rangeSelector: {
              buttonTheme: {
                 fill: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                       [0.4, '#888'],
                       [0.6, '#555']
                    ]
                 },
                 stroke: '#000000',
                 style: {
                    color: '#CCC',
                    fontWeight: 'bold'
                 },
                 states: {
                    hover: {
                       fill: {
                          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                          stops: [
                             [0.4, '#BBB'],
                             [0.6, '#888']
                          ]
                       },
                       stroke: '#000000',
                       style: {
                          color: 'white'
                       }
                    },
                    select: {
                       fill: {
                          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                          stops: [
                             [0.1, '#000'],
                             [0.3, '#333']
                          ]
                       },
                       stroke: '#000000',
                       style: {
                          color: 'yellow'
                       }
                    }
                 }
              },
              inputStyle: {
                 backgroundColor: '#333',
                 color: 'silver'
              },
              labelStyle: {
                 color: 'silver'
              }
           },

           navigator: {
              handles: {
                 backgroundColor: '#666',
                 borderColor: '#AAA'
              },
              outlineColor: '#CCC',
              maskFill: 'rgba(16, 16, 16, 0.5)',
              series: {
                 color: '#7798BF',
                 lineColor: '#A6C7ED'
              }
           },

           scrollbar: {
              barBackgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                       [0.4, '#888'],
                       [0.6, '#555']
                    ]
                 },
              barBorderColor: '#CCC',
              buttonArrowColor: '#CCC',
              buttonBackgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                       [0.4, '#888'],
                       [0.6, '#555']
                    ]
                 },
              buttonBorderColor: '#CCC',
              rifleColor: '#FFF',
              trackBackgroundColor: {
                 linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                 stops: [
                    [0, '#000'],
                    [1, '#333']
                 ]
              },
              trackBorderColor: '#666'
           },

           // special colors for some of the demo examples
           legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
           legendBackgroundColorSolid: 'rgb(70, 70, 70)',
           dataLabelsColor: '#444',
           textColor: '#E0E0E0',
           maskColor: 'rgba(255,255,255,0.3)'
        };

        // Apply the theme
        var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
    }
});
