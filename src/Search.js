import React from 'react';

export function Search({update, devices}) {
	const dataSearch = e => {
		const value = e.target.value.toLowerCase();
		const filtered = devices.filter(item => {
			return item.name.toLowerCase().includes(value);
		})
		update(filtered);
	}
	return (
		<div>
			<input onChange={dataSearch} type="text" placeholder="Type to search"></input>
		</div>
	)
}

//  w W /