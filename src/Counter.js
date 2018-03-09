import React from 'react';

export function Counter({devices}) {
	var onArray = [];
	var offArray =[];
	devices.forEach(elem => {
		elem.active ? onArray.push(elem.active) : offArray.push(elem.active);
	})
	return (
		<div id="counter-container">
			<div><p>Active devices:</p><h2>{onArray.length}</h2></div>
			<div><p>Inactive devices:</p><h2>{offArray.length}</h2></div>
		</div>
	)
}