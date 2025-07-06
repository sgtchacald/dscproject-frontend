import { Component, AfterViewInit } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-grafico-despesas-por-categoria',
  templateUrl: './grafico-despesas-por-categoria.component.html',
  styleUrls: ['./grafico-despesas-por-categoria.component.scss']
})
export class GraficoDespesasPorCategoriaComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const chartDom = document.getElementById('grafico-despesas-por-categoria');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        type: 'plain',
        orient: 'vertical',
        top: 10,
        left: 5
        //data: data.legendData
      },
      series: [
        {
          name: 'Descrição',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['65%', '40%'],
          avoidLabelOverlap: false,
          padAngle: 1,
          itemStyle: {
            borderRadius: 0
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 15,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: 'Moradia' },
            { value: 735, name: 'Alimentação' },
            { value: 580, name: 'Cartão de Crédito' },
            { value: 484, name: 'Vestuário' },
            { value: 300, name: 'Lazer' }
          ]
        }
      ]
    };

    myChart.setOption(option);
  }

}
