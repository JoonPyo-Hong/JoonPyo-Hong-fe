import Link from 'next/link';
import type { NextPage } from 'next';
import React, { useState,useEffect}  from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useRouter } from 'next/router'
import { useRecoilState } from "recoil";
import { userState } from '../recoil/user';

const LoginPage: NextPage = () => {

  const router = useRouter();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser]= useRecoilState(userState);

  const [isId, setIsId] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  const [idMessage, setIdMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const login = () =>{
    loginPost();
  }

  const loginPost = async () => {
    axios.post("https://api.sixshop.com/login", {
      id: id,
      password: password
    })
    .then(function (response) {      
      setUser(response.data.data.user.id);
      router.push('/');
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const checkId = () => { 
   const regex = /^[a-z|A-Z|0-9|]+$/;
    if(id.length > 0 && (id.length < 5 || id.length > 30 || !regex.test(id))){
      setIdMessage("올바른 아이디 형식으로 입력해주세요.");
    }else{
      setIdMessage("");
    }
  }

  const checkPassword = () => {
    const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/;
    if(password.length > 0 && (password.length < 8 || password.length > 30 || !regex.test(password))){      
      setPasswordMessage("올바른 비밀번호 형식으로 입력해주세요.");
    }else{
      setPasswordMessage("");
    }
  }
  const onChangeId = (e: any) => { 
      setId(e.target.value);
      const regex = /^[a-z|A-Z|0-9|]+$/;
      if(e.target.value.length > 0 && (e.target.value.length < 5 || e.target.value.length > 30 || !regex.test(e.target.value))){
        setIsId(false);
      }else{
        setIsId(true);  
        setIdMessage("");    
      }
   }
  const onChangePassword = (e: any) => {
      setPassword(e.target.value);
      const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/;
      if(e.target.value.length > 0 && (e.target.value.length < 8 || e.target.value.length > 30 || !regex.test(e.target.value))){
        setIsPassword(false);
      }else{
        setIsPassword(true);
        setPasswordMessage("");
      }
  }

  useEffect(() => {
    if(user){
      router.push('/');
    }
  }, [])

  return (
    <>
      <Header>
        <Link href='/'>
          <Title>HAUS</Title>
        </Link>
        <Link href='/login'>
          <p>login</p>
        </Link>
      </Header>
      <Form>
        <TextTitle>아이디</TextTitle>
        <TextInput 
          type='text' 
          onChange={onChangeId}
          value={id} 
          onBlur={checkId}
          style={idMessage ? {backgroundColor :"#FDEDEE"}:{}}
        />
        <TextHidden>{idMessage}</TextHidden>
        <TextTitle style={{marginTop:"16px"}}>비밀번호</TextTitle>
        <TextInput 
          type='password' 
          onChange={onChangePassword}
          value={password} 
          onBlur={checkPassword}
          style={passwordMessage ? {backgroundColor :"#FDEDEE"}:{}}
        />
        <TextHidden>{passwordMessage}</TextHidden>
        <LoginButton onClick={login} disabled={!(isId && isPassword && id.length > 0 && password.length > 0)}>로그인</LoginButton>
      </Form>
    </>
  );
};


export default LoginPage;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const Title = styled.a`
  font-size: 48px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  padding: 0 20px 40px;
`;

const TextTitle = styled.div`
 font-weight: 700px
 font-size:13px;
 color:#6C6C7D;
`;

const TextHidden = styled.div`
 margin-top:8px;
 font-weight: 400;
 font-size:13px;
 color:#ED4E5c;
`;

const TextInput = styled.input`
  margin-top: 8px;
  padding: 16px;
  background-color: #F2F7FA;
  border-radius:12px;
`;

const LoginButton = styled.button`
  margin-top: 40px;
  padding: 20px;
  border-radius: 12px;
  background-color: #222;
  color: #fff;

  &:disabled {
    background-color: #e2e2ea;
  }
`;
