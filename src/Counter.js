import React from 'react';

export function Counter({devices}) {
	var onArray = [];
	var offArray =[];
	devices.forEach(elem => {
		elem.active ? onArray.push(elem.active) : offArray.push(elem.active)
	})
	return (
		<div>
			<p>Active devices: {onArray.length}</p>
			<p>Inactive devices: {offArray.length}</p>
		</div>
	)
}