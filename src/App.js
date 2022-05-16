import {useState, useEffect} from 'react';
import { Layout, Divider } from 'antd';
import { format } from 'date-fns';
import InputCodes from './components/InputCodes';
import RepeatedCodes from './components/RepeatedCodes';
import styles from './App.module.css';
import Logo from './logo.svg';

const { Header, Content, Footer } = Layout;
const loadStorage = ()=>JSON.parse(localStorage.getItem('codes')) || {};

function App() {
  const [storedCodes, setStoredCodes] = useState([]);
  const [batchCodes, setBatchCodes] = useState('');

  const handleSave = ()=>{
    const currentCodes = batchCodes.split(/\n/).filter(Boolean);
    const stored = loadStorage();
    stored[format(new Date(), 'yyyy-MM-dd')] = currentCodes;

    localStorage.setItem('codes', JSON.stringify(stored));
    setStoredCodes(
        Object.entries(stored).reduce((acc, [key, values])=> [...acc, ...values.map(value=>({date: key, value }))],[])
    )
  }

  const handleDelete = (duplicateCodes, isSelectedAll)=>{
    const currentCodes = batchCodes.split(/\n/).filter(Boolean);

    setBatchCodes(currentCodes
      .filter(value=> isSelectedAll 
        ? !duplicateCodes.find(duplicateCode => duplicateCode.value===value)
        : !duplicateCodes.find(duplicateCode => duplicateCode.selected && duplicateCode.value===value )
      )
      .reduce((acc, value, i)=> ([...acc, ...i!==0 && i%4===0 ? ['', '', value] : [value] ]),[])
      .join('\n')
    )
  }
  
  useEffect(()=>{
    setStoredCodes(
        Object.entries(loadStorage()).reduce((acc, [key, values])=> [...acc, ...values.map(value=>({date: key, value }))],[])
    )
  },[]);

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header} >
      <img src={Logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.title} >Code scan</h1>
      </Header>

      <Content className={styles.content}>
        <InputCodes onChangeCodes={({target})=>setBatchCodes(target.value)} batchCodes={batchCodes} onSave={handleSave} />
        <Divider type="vertical" />
        <RepeatedCodes batchCodes={batchCodes} storedCodes={storedCodes} onDelete={handleDelete} />
      </Content>

      <Footer className={styles.footer} >Made with 💖 by <strong>Abdiel</strong> <em>v.1.0.0</em></Footer>
    </Layout>
  );
}

export default App;
