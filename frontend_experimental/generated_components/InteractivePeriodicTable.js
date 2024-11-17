import React, { useState } from 'react';

const elementData = [
  { symbol: 'H', atomicNumber: 1, atomicMass: 1.00794, name: 'Hydrogen', group: 1, period: 1, block: 's', electronConfiguration: '1s1', isotopes: ['1H', '2H', '3H'] },
  { symbol: 'He', atomicNumber: 2, atomicMass: 4.002602, name: 'Helium', group: 18, period: 1, block: 's', electronConfiguration: '1s2', isotopes: ['3He', '4He'] },
  // Add more elements to the array...
];

const elementCategories = {
  metals: ['Alkali metals', 'Alkaline earth metals', 'Lanthanides', 'Actinides', 'Transition metals', 'Post-transition metals'],
  nonmetals: ['Noble gases', 'Halogens', 'Chalcogens', 'Pnictogens'],
  metalloids: ['Boron group', 'Carbon group', 'Nitrogen group', 'Oxygen group'],
};

const colors = {
  metals: '#6495ED',
  nonmetals: '#DC143C',
  metalloids: '#FFFF00',
};

const InteractivePeriodicTable = () => {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('atomicNumber');

  const filteredElements = elementData.filter((element) => {
    if (!filter) return true;
    return element.name.toLowerCase().includes(filter.toLowerCase());
  });

  const sortedElements = filteredElements.sort((a, b) => {
    if (sort === 'atomicNumber') return a.atomicNumber - b.atomicNumber;
    if (sort === 'atomicMass') return a.atomicMass - b.atomicMass;
    if (sort === 'name') return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter by name" />
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="atomicNumber">Atomic Number</option>
        <option value="atomicMass">Atomic Mass</option>
        <option value="name">Name</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Atomic Number</th>
            <th>Atomic Mass</th>
            <th>Name</th>
            <th>Group</th>
            <th>Period</th>
            <th>Block</th>
            <th>Electron Configuration</th>
            <th>Isotopes</th>
          </tr>
        </thead>
        <tbody>
          {sortedElements.map((element) => (
            <tr key={element.symbol} style={{ backgroundColor: colors[elementCategories[element.group]] }}>
              <td>{element.symbol}</td>
              <td>{element.atomicNumber}</td>
              <td>{element.atomicMass}</td>
              <td>{element.name}</td>
              <td>{element.group}</td>
              <td>{element.period}</td>
              <td>{element.block}</td>
              <td>{element.electronConfiguration}</td>
              <td>{element.isotopes.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InteractivePeriodicTable;