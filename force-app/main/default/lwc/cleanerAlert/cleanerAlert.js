import { LightningElement, track} from 'lwc'
import chartjs from '@salesforce/resourceUrl/ChartJs'; 
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getLimits from '@salesforce/apex/StorageAlertController.getLimits';

export default class CleanerAlert extends LightningElement {
	chart;
	message;
	value = 'Clear Logs';
	@track isLoading = true;
	isRefresh = false;
	clearData = false;

	connectedCallback() {
		this.init();
	}

    async init(){
        // this.runGetLimits();
		this.isLoading = false;
    }

	get options() {
        return [
            { label: 'Clear Logs', value: 'Clear Logs' },
            { label: 'Clear Only Data', value: 'Clear Only Data' },
            { label: 'Clear Only Files', value: 'Clear Only Files' },
			{ label: 'Clear Files and Data', value: 'Clear Files and Data' },
			{ label: 'Clear All', value: 'Clear All' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
		if(this.value == 'Clear Only Data'){
			this.isLoading = true;
			this.clearData = true;
			setTimeout(() => {
				this.isLoading = false;
			}, 2000);
		}
    }

	refresh(){
		this.isRefresh = true;
		this.isLoading = true;
		this.showBannerAlert();
		setTimeout(() => {
			this.clearData = false;
			this.isLoading = false;
		}, 2000);
	}

	showBannerAlert(){
        getLimits({storageName:'DataStorageMB'})
		.then(res => {
			if (res) {
				if(res.remaining <= 10){
					this.message = `Restando somente ${res.remaining} de espaço na org`;
					this.lastConsult = 'Ultima consulta: 01-01-1992 21:99';
				}
			}
			setTimeout(() => {
				this.isLoading = false;
			}, 2000);	
		})
		.catch(err => {
			console.log('err: ' + JSON.stringify(res));
		})

		getLimits({storageName:'FileStorageMB'})
		.then(res => {
			if (res) {
				this.message = `Restando somente ${res.remaining} de espaço na org`;
				this.lastConsult = 'Ultima consulta: 01-01-1992 21:99';
			}
			setTimeout(() => {
				this.isLoading = false;
			}, 2000);	
		})
		.catch(err => {
			console.log('err: ' + JSON.stringify(res));
		})
	}

	updateChart(count, label) {
		if (!this.chart.data.labels.includes(label)) {
			this.chart.data.labels.push(label);
			this.chart.data.datasets.forEach((dataset) => {
				dataset.data.push(count);
			});
			this.chart.update();
		} else {
			console.log(`Value '${label}' already exists in the chart.`);
		}
	}

	formatDate(dateString) {
		const options = { 
			year: 'numeric', 
			month: '2-digit', 
			day: '2-digit', 
			hour: '2-digit', 
			minute: '2-digit' 
		};
		const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(new Date(dateString));
		return formattedDate;
	}
}