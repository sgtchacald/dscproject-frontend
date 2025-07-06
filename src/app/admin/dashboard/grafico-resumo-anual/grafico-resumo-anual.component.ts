import { Component } from '@angular/core';
import * as echarts from "echarts";

@Component({
  selector: 'app-grafico-resumo-anual',
  templateUrl: './grafico-resumo-anual.component.html',
  styleUrls: ['./grafico-resumo-anual.component.scss']
})
export class GraficoResumoAnualComponent {

  ngAfterViewInit(): void {
    const app: any = {};
    type EChartsOption = echarts.EChartsOption;

    const chartDom = document.getElementById('grafico-resumo-anual')!;
    const myChart = echarts.init(chartDom);
    let option: EChartsOption;

    const posList = [
      'left',
      'right',
      'top',
      'bottom',
      'inside',
      'insideTop',
      'insideLeft',
      'insideRight',
      'insideBottom',
      'insideTopLeft',
      'insideTopRight',
      'insideBottomLeft',
      'insideBottomRight'
    ] as const;

    app.configParameters = {
      rotate: {
        min: -90,
        max: 90
      },
      align: {
        options: {
          left: 'left',
          center: 'center',
          right: 'right'
        }
      },
      verticalAlign: {
        options: {
          top: 'top',
          middle: 'middle',
          bottom: 'bottom'
        }
      },
      position: {
        options: posList.reduce(function (map, pos) {
          map[pos] = pos;
          return map;
        }, {} as Record<string, string>)
      },
      distance: {
        min: 0,
        max: 100
      }
    };

    app.config = {
      rotate: 90,
      align: 'left',
      verticalAlign: 'middle',
      position: 'insideBottom',
      distance: 15,
      onChange: function () {
        const labelOption: BarLabelOption = {
          rotate: app.config.rotate as BarLabelOption['rotate'],
          align: app.config.align as BarLabelOption['align'],
          verticalAlign: app.config.verticalAlign as BarLabelOption['verticalAlign'],
          position: app.config.position as BarLabelOption['position'],
          distance: app.config.distance as BarLabelOption['distance']
        };
        myChart.setOption<echarts.EChartsOption>({
          series: [
            {
              label: labelOption
            },
            {
              label: labelOption
            },
            {
              label: labelOption
            },
            {
              label: labelOption
            }
          ]
        });
      }
    };

    type BarLabelOption = NonNullable<echarts.BarSeriesOption['label']>;

    const labelOption: BarLabelOption = {
      show: true,
      position: app.config.position as BarLabelOption['position'],
      distance: app.config.distance as BarLabelOption['distance'],
      align: app.config.align as BarLabelOption['align'],
      verticalAlign: app.config.verticalAlign as BarLabelOption['verticalAlign'],
      rotate: app.config.rotate as BarLabelOption['rotate'],
      formatter: '{c}  {name|{a}}',
      fontSize: 16,
      rich: {
        name: {}
      }
    };

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Receita', 'Despesa', 'Saldo']
      },
      toolbox: {
        show: false,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro', ]
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Receita',
          type: 'bar',
          barGap: 0,
          label: labelOption,
          emphasis: {
            focus: 'series'
          },
          data: [320, 332, 301, 334, 390]
        },
        {
          name: 'Despesa',
          type: 'bar',
          label: labelOption,
          emphasis: {
            focus: 'series'
          },
          data: [220, 182, 191, 234, 290]
        },
        {
          name: 'Saldo',
          type: 'bar',
          label: labelOption,
          emphasis: {
            focus: 'series'
          },
          data: [150, 232, 201, 154, 190]
        }
      ]
    };

    option && myChart.setOption(option);

  }
}
