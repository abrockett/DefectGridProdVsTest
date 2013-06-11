Ext.define('DefectGridApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    items: [
        {
            xtype: 'rallychart',

            storeConfig: {
                fetch: ['Name','Environment','OpenedDate','Project','CreationDate'],
                hydrate: ['Environment'],
                filters: [
                    {
                        property: '_ProjectHierarchy',
                        operator: '=',
                        value: 1971104447
                    },
                    {
                        property: '_TypeHierarchy',
                        operator: '=',
                        value: 'Defect'
                    },
                    {
                        property: 'Resolution',
                        operator: '=',
                        value: 'Duplicate'
                    },
                    {
                        property: '_ValidFrom',
                        operator: '=',
                        value: {
                            $gte: "2010-02-01TZ",
                            $lte: "current"
                        }
                    }
                ]
            },

            calculatorType: 'ProdVsTestCalculator',
            calculatorConfig: {
            },

            chartConfig: {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Defect Trends'
                },
                xAxis: {
                    tickmarkPlacement: 'on',
                    tickInterval: 2,
                    title: {
                        text: 'Month'
                    }
                },
                yAxis: [
                    {
                        title: {
                            text: 'Count'
                        }
                    }
                ],
                plotOptions: {
                    series: {
                        marker: {
                            enabled: false
                        }
                    },
                    area: {
                        stacking: 'normal'
                    }
                }
            }
        }
    ]
});