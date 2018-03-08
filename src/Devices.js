import React from 'react';
import axios from 'axios';

import { Counter } from './Counter';
import { Search } from './Search';

export class Devices extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			switcher: true,
			filteredDevices: [],
			sortedData: []
		};
		this.sortDirection = {name: true, unit: true, value: true, timestamp: true, active: true}
		this.updateData = this.updateData.bind(this);
		this.changeStatus = this.changeStatus.bind(this);
		this.updateState = this.updateState.bind(this);
		this.sort = this.sort.bind(this);
	}

	componentDidMount() {
		axios.get('http://127.0.0.1:8888/device')
		.then((res) => {
			this.setState({
				devices: res.data.data	
			})	
		})
	}

	updateData(items) {
	    this.setState({
	    	filteredDevices: items,
	    	sortedData: items
	    });
	}

	changeStatus(name, status) {
		var newStatus = status ? 'false' : 'true';

		axios.patch(`http://127.0.0.1:8888/device/${name}?active=${newStatus}`)
		.then((res) => {
			if (res.statusCode = 200) {
				this.updateState();
			} 
		})
		.catch((err) => {
			this.changeStatus(name, status);
			console.log('patch failed', err.stack);
		})	
	}

	updateState() {
		axios.get('http://127.0.0.1:8888/device')
		.then((res) => {
			this.setState({
				devices: res.data.data	
			})
		})
		.catch((err) => {
			console.log('updateState failed', err.stack)
		})	

	}

	sort(type) {

		let sortDirectionByType = this.sortDirection[type];
		console.log('sortDirectionByType', sortDirectionByType)
		let direction = sortDirectionByType ? 1 : -1;
		console.log('direction', direction)
		let needToSort = this.state.devices;
		console.log(needToSort)
		let sorted = needToSort.sort((a, b) => {
			if (a[type] === b[type]) {return 0;}
			return a[type] > b[type] ? direction : direction * -1;
		})
		this.sortDirection[type] = !sortDirectionByType;
		this.updateData(sorted);
	}

	render() {
		if (!this.state.devices  || !this.state.filteredDevices || !this.state.sortedData) {
			return null
		}
		var renderData = this.state.devices;
		if (this.state.filteredDevices.length) {
			renderData = this.state.filteredDevices;
		}
		if (this.state.sortedData.length) {
			renderData = this.state.sortedData;
		}
		console.log('renderData', this.state)

		return (	
			<div>  
				<Search update={result => this.updateData(result)} 
					devices={this.state.devices} />  
				<table border="1">
				    <caption>List of Devices</caption>
				    <tbody>
					    <tr>
						    <th onClick={() => this.sort('name')}>Name</th>
						    <th onClick={() => this.sort('unit')}>Unit</th>
						    <th onClick={() => this.sort('value')}>Value</th>
						    <th onClick={() => this.sort('timestamp')}>Timestamp</th>
						    <th onClick={() => this.sort('active')}>Status</th>
					   	</tr>
					   		{renderData.map((item, index) => {
					   			var date = new Date(item.timestamp);
					   			var dateString = date.toTimeString().slice(0, 8);
					   			var status = item.active ? 'Active' : 'Inactive';					   			return (
					   				<tr key={index}>
						   				<td onClick={() => this.changeStatus(item.name, item.active)}>{item.name}</td>
						   				<td>{item.unit}</td>
						   				<td>{item.value}</td>
						   				<td>{dateString}</td>
						   				<td onClick={() => this.changeStatus(item.name, item.active)}>{status}</td>
						   			</tr>
					   			)	
					   		})}	
				   	</tbody>  
				</table>
				<Counter devices={renderData} />
			</div>	
		)
	}
}

// function increase(a, b) {
//     if (a[type] > b[type]) {
//         return 1;
//     } else if (a[type] < b[type]) {
//         return -1;
//     } else {
//         return 0;
//     }

// }

// function decrease(a, b) {
//     if (a[type] > b[type]) {
//         return -1;
//     } else if (a[type] < b[type]) {
//         return 1;
//     } else {
//         return 0;
//     }

// }

//  w W /
