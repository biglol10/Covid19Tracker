import React, { useState, useEffect } from 'react';
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core';
import InfoBox from './InfoBox/InfoBox'
import Map from './Map/Map'
import Table from './Table/Table'
import { sortData } from './Util/util'
import LineGraph from './Graph/LineGraph'
import { prettyPrintStat } from './Util/util'


function App() {
  const [ countries, setCountries ] = useState([]);
  const [ country, setCountry ] = useState('worldwide');
  const [ countryInfo, setCountryInfo ] = useState({});
  const [ tableData, setTableData ] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [ casesType, setCasesType ] = useState('cases');

  const aKey = 'nd0dqIXndhBjVBx%2F4IYidwc7x%2F38EzQFfI0XClM94SulPMgNSMMa4tjAGRcnJDTUesvslRp2zSOiWZ19458ifw%3D%3D';

  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, [])

  useEffect(()=>{
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        })
    }
    getCountriesData();
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        console.log(data);
        setMapCenter([data.countryInfo?.lat ? data.countryInfo?.lat : 34.80746, data.countryInfo?.long ? data.countryInfo?.long : -40.4796]);
        setMapZoom(4);
      });

    // https://disease.sh/v3/covid-19/countries/all
    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          {/* Material UI */}
          <FormControl className="app__dropdown">  
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem style={{color:'blue'}} value="worldwide">Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
              {/* <MenuItem value="worldwide">Worldwide</MenuItem>
              <MenuItem value="worldwide">Option2</MenuItem>
              <MenuItem value="worldwide">Option3</MenuItem>
              <MenuItem value="worldwide">Option4</MenuItem> */}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox 
            isRed
            active={casesType === 'cases'}
            onClick={e => setCasesType('cases')}
            title='Coronavirus cases' 
            total={prettyPrintStat(countryInfo.cases)} 
            cases={prettyPrintStat(countryInfo.todayCases)}/>

          <InfoBox 
            active={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')}
            title='Recovered' 
            total={prettyPrintStat(countryInfo.recovered)} 
            cases={prettyPrintStat(countryInfo.todayRecovered)}/>

          <InfoBox
            isRed
            active={casesType === 'deaths'}
            onClick={e => setCasesType('deaths')}
            title='Deaths' 
            total={prettyPrintStat(countryInfo.deaths)} 
            cases={prettyPrintStat(countryInfo.todayDeaths)}/>
        </div>

        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData}/>
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
