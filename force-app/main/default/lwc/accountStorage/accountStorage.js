import { LightningElement, api, track} from 'lwc'
import chartjs from '@salesforce/resourceUrl/ChartJs'; 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript } from 'lightning/platformResourceLoader';
import getAccounts from '@salesforce/apex/StorageAlertController.getAccountsByType';
import deleteAccounts from '@salesforce/apex/StorageAlertController.deleteAccounts';
import getLimits from '@salesforce/apex/StorageAlertController.getLimits';


export default class AccountStorage extends LightningElement {

    chart;
	chartjsInitialized = false;

    @api clearAccounts;

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
			//responsive : true,
			maintainAspectRatio: false,
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
		this.runGetAccounts();
    }

    runGetAccounts(){
        getAccounts({accountType: 'Customer - Direct'})
            .then(accounts => {
                if(accounts){
                    console.log('res:', accounts);
                    console.log('this.clearAccounts:', this.clearAccounts);

                    if(this.clearAccounts == true){
                        this.runDeleteAccounts(accounts);
					}else{
                        const size = accounts.length;
						this.updateChart(size, 'Existing');
					}
                }
            }).catch(err => {
                console.log('err: ' + accounts);
            })
    }

    runDeleteAccounts(accounts){
        deleteAccounts({accountsToDelete: accounts})
    }

    renderedCallback(){
        if(this.chartjsInitialized){
            return;
        }
        this.chartjsInitialized = true;

        Promise.all([
            loadScript(this, chartjs)
        ]).then(() =>{
            const ctx = this.template.querySelector('canvas.donut').getContext('2d');

            console.log(ctx);

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

   
	@api
	updateChart(count,label){
		this.chart.data.labels.push(label);
		this.chart.data.datasets.forEach((dataset) => {
			dataset.data.push(count);
		});
		this.chart.update();
	}

}