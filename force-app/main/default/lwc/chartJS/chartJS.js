import { LightningElement, track} from 'lwc'
import chartjs from '@salesforce/resourceUrl/ChartJs'; 
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getLimits from '@salesforce/apex/StorageAlertController.getLimits';

export default class ChartJS extends LightningElement {
    chart;
	chartjsInitialized = false;
	config={
		type : 'doughnut',
		data :{
			datasets :[{
				data: [],
				backgroundColor :[
					'rgb(255,99,132)',
					'rgb(255,159,64)',
					'rgb(255,205,86)',
					'rgb(75,192,192)',
				],
				label:'Dataset 1'
			}],
			labels:[]
		},
		options: {
			responsive : true,
			legend : {
				position :'right'
			},
			animation:{
				animateScale: true,
				animateRotate : true
			}
		}
	};

    connectedCallback() {
		this.init();
	}

    async init(){
        this.runGetLimits();
    }

    runGetLimits(){
		getLimits({})
		.then(res => {
			if (res) {
				this.updateChart(res.remaining, 'Remaining');
                this.updateChart(90, 'Max');
			}
		})
		.catch(err => {
			console.log('err: ' + JSON.stringify(res));
		})
	}

    renderedCallback(){
        if(this.chartjsInitialized){
         return;
        }
        this.chartjsInitialized = true;

        Promise.all([
            loadScript(this,chartjs)
        ]).then(() =>{
            const ctx = this.template.querySelector('canvas.donut')
            .getContext('2d');
            this.chart = new window.Chart(ctx, this.config);
        }).catch(error =>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title : 'Error loading ChartJS',
                    message : error.message,
                    variant : 'error',
                }),
            );
        });
	}

	updateChart(count,label){
		this.chart.data.labels.push(label);
		this.chart.data.datasets.forEach((dataset) => {
			dataset.data.push(count);
		});
		this.chart.update();
	}
}