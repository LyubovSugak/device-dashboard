import React from 'react';
import axios from 'axios';

import { Counter } from './Counter';
import { Search } from './Search';

export class Devices extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filteredDevices: [],
			sortedData: []
		};
		this.sortDirection = {name: true, unit: true, value: true, timestamp: true, active: true}
		this.updateData = this.updateData.bind(this);
		this.changeStatus = this.changeStatus.bind(this);
		this.updateState = this.updateState.bind(this);
		this.sort = this.sort.bind(this);
		this.copmare = this.copmare.bind(this);
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
	    })
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
			this.copmare(res.data.data)
			this.setState({
				devices: res.data.data,
				filteredDevices: this.state.filteredDevices,
		    	sortedData: this.state.sortedData
			})	
		})
		.catch((err) => {
			console.log('updateState failed', err.stack)
		})
	}

	copmare(newDevices) {
		for (var i = 0; i < newDevices.length; i++) {
			this.state.sortedData.forEach(item => {
				if (newDevices[i].name === item.name 
					&& newDevices[i].active !== item.active) {
					item.active = newDevices[i].active;
				}
			})
		}
	}

	sort(type) {
		let sortDirectionByType = this.sortDirection[type];
		let direction = sortDirectionByType ? 1 : -1;
		let needToSort = this.state.devices;
		let sorted = needToSort.sort((a, b) => {
			if (a[type] === b[type]) {return 0;}
			return a[type] > b[type] ? direction : direction * -1;
		})
		this.sortDirection[type] = !sortDirectionByType;
		this.updateData(sorted);
	}

	render() {
		let {devices, filteredDevices, sortedData} = this.state;
		if (!devices  || !filteredDevices || !sortedData) {
			return null
		}
		var renderData = devices;
		if (filteredDevices.length) {
			renderData = filteredDevices;
		}
		if (sortedData.length) {
			renderData = sortedData;
		}

		return (	
			<div id="devices-container">  
				<Search update={result => this.updateData(result)} 
					devices={this.state.devices} />  
				<table>
				    
				    <thead>
					    <tr>
						    <th onClick={() => this.sort('name')}>Name<div>&uarr;&darr;</div></th>
						    <th onClick={() => this.sort('unit')}>Unit<div>&uarr;&darr;</div></th>
						    <th onClick={() => this.sort('value')}>Value <div>&uarr;&darr;</div></th>
						    <th onClick={() => this.sort('timestamp')}>Timestamp<div>&uarr;&darr;</div></th>
						    <th onClick={() => this.sort('active')}>Status<div>&uarr;&darr;</div></th>
					   	</tr>
					</thead>
					<tbody>
				   		{renderData.map((item, index) => {
				   			var date = new Date(item.timestamp);
				   			var dateString = date.toTimeString().slice(0, 8);
				   			var status = item.active ? 'Active' : 'Inactive';					   			
				   			return (
				   				<tr key={index}>
					   				<td onClick={() => this.changeStatus(item.name, item.active)}>{item.name}</td>
					   				<td>{item.unit}</td>
					   				<td>{item.value}</td>
					   				<td>{dateString}</td>
					   				<td className={item.active ? 'active' : 'inactive'} onClick={() => this.changeStatus(item.name, item.active) }>{status}</td>
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



//  w W /
