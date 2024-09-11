import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View , Modal , TouchableOpacity, SafeAreaView, TextInput, Alert, ScrollView } from 'react-native';

import {Ionicons} from '@expo/vector-icons';
import axios from 'axios';

export default function App() {
  
  const api = 'http:/10.68.36.102/2mtec/apireact/';
  const[lista,setLista] = useState([]);
  const[nome,setNome] = useState('');
  const[email,setEmail] = useState('');
  const[senha,setSenha] = useState('');
  const[id, setId] = useState('');
  const[buscar,setBuscar] = useState('');

  const[abrir,setAbrir] = useState(false);

  const mensagemDuplicidade = () =>
    Alert.alert(
      "Erro ao Salvar",
      "Email já Cadastrado",
      [
        {text: "OK" , onPress: () =>setAbrir(true)}
      ],
      {cancelable: true}    
    )

  //use Effect verifica atualizações no App
  useEffect(() => {
    listarDados();    
  },[]);
  
  async function listarDados() {
    const res = await axios.get(api + 'listar.php?busca=' + buscar);
    setLista(res.data.result);
  }

  async function add(){
    const obj = {nome,email,senha,id};
    const res = await axios.post(api + 'add.php', obj)

    if(res.data.success == true)
    {
      limparDados();
    }

    if (res.data.success == "Email já Cadastrado!"){
      mensagemDuplicidade();
    }
    listarDados();
    setAbrir(false);
  }

  function limparDados(){
    setNome('');
    setEmail('');
    setSenha('');
    setId(0);
  }

  return(
    <View>
      <View style={styles.navbar}>
        <Text style={styles.textonavbar}>Lista de Usuários</Text>
        <TouchableOpacity
           style={styles.botao}
           onPress={() => setAbrir(true)}
        >
          <Ionicons name="add" size={30} color="#FFF"></Ionicons>
        </TouchableOpacity>
      </View>
       <ScrollView>
         <View style={styles.grid}>
           {lista.map(item => 
             <View style={styles.griditem} key={item.id}>
               <Text style={{color:'#585858'}}> {item.id} - {item.nome} - {item.email}</Text>
             </View>
           )}
         </View>
       </ScrollView>
       <Modal
         animationType="slide"
         transparent={false}
         visible={abrir}      
       >
         <SafeAreaView style={styles.modal}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setAbrir(false)}
              >
                <Ionicons style={{marginLeft:5, marginRight:5}} name="arrow-back" size={35} color="#FFF"></Ionicons>
              </TouchableOpacity>
              <Text style={styles.textoModal}>Inserir Usuário</Text>
            </View>

            <TextInput
              type="text"
              style={styles.input}
              placeholder='Insira um nome'
              value={nome}
              onChangeText={(nome) => setNome(nome)}
            >
            </TextInput>

            <TextInput
              type="text"
              style={styles.input}
              placeholder='Insira um email'
              value={email}
              onChangeText={(email) => setEmail(email)}
            >
            </TextInput>

            <TextInput
              style={styles.input}
              placeholder='Insira a senha'
              value={senha}
              onChangeText={(senha) => setSenha(senha)}
              secureTextEntry={true}
            >
            </TextInput>
            <TouchableOpacity
              style={styles.botaoModal}
              onPress={add}
            >
              <Text style={styles.textoBotaoModal}>Salvar</Text>
            </TouchableOpacity>

         </SafeAreaView>
       </Modal>
    </View>
  )
   
}
const styles = StyleSheet.create({
  modal:{
    flex: 1,
    backgroundColor:'#b2b2b2'    
  },

  textoModal:{    
    color: '#FFF',    
    marginLeft: 15,
    fontSize:25,      
  },

  modalHeader:{    
   marginLeft:10,
   marginTop:20,
   alignItems:'center',
   flexDirection:'row',
   marginBottom:30,    
  },

  input:{
    backgroundColor: '#FFF',
    borderRadius: 5,
    margin: 8,
    padding: 8,
    color: '#000',
    fontSize:13
  },
  botaoModal:{
    backgroundColor: '#00335c',
    borderRadius: 5,
    margin: 5,
    padding: 12,
    color: '#FFF',
    alignItems:'center',
    justifyContent:'center',    
  },
  textoBotaoModal:{
    fontSize:16,
    color:'#FFF',
  },
  navbar:{
    backgroundColor: '#00335c',
    padding: 12,
    color: '#FFF',
    flexDirection:'row',
    marginTop: 35,
  },
  textonavbar:{
    fontSize:20,
    color:'#FFF',
    marginTop: 4,
    marginBottom: 2,
  },
  botao:{
    position: 'absolute', 
    right: 13,
    marginTop: 11,
  },
  grid:{
    marginTop: 8,    
  },
  griditem:{
    padding: 11,
    borderBottomColor: "#dbdbdb",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
});
