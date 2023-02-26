import Link from 'next/link';
import type { NextPage } from 'next';
import React, { useState,useEffect}  from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Product } from '../../types/product';
import {useRecoilState} from "recoil";
import { userState } from '../../recoil/user';

const ProductDetailPage: NextPage = () => {
  
  const router = useRouter();
  const page = router.query.id;

  const [message, setMessage] = useState('');
  const [products, setProducts] = useState<Product| undefined>();

  const [user,setUser]= useRecoilState(userState);
  const [userName, setUserName] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  
  const getProduct = async () => { 
    
    axios.get(`https://api.sixshop.com/products/${Number(page)}`)
    .then(function (response) {
      setProducts(response.data.data.product);
      setMessage("");
    })
    .catch(function (error) {
      setMessage("존재하지 않는 페이지입니다.");
      console.log(error);
    });
    
  }
  const getUserName = async () => {
    axios.get(`https://api.sixshop.com/users/${user}`)
    .then(function (response) {
     setUserName(response.data.data.user.name);
     setIsLogin(true);
    })
    .catch(function (error) {
      console.log(error);
      setUserName("");
      setIsLogin(true);
    });
  }
  
  const logOut = () => {
    if(confirm("로그아웃 하시겠습니까?")){
      setUser(null);
      setUserName("");
    }
  };

  useEffect(() => {
    if(router.query.id){
      getProduct();
    }
  }, [page])
  useEffect(() => {
    if(user){
      getUserName();
    }else{
      setIsLogin(true);
    }
  }, [])
  
  return (
    <>
      <Header>
        <Link href='/'>
          <Title>HAUS</Title>
        </Link>
        {userName && isLogin &&
          <div>
            <p>
              {userName}
            </p>
            <LoginTitle onClick={logOut}>
              logout
            </LoginTitle>
          </div> 
          }
          {!userName && isLogin &&
            <Link href='/login'>
              <LoginTitle>login</LoginTitle>
            </Link>
          }
      </Header>
      {products ? 
        <>
        <Thumbnail src={products.thumbnail ? products.thumbnail : '/defaultThumbnail.jpg'} />
        <ProductInfoWrapper>
          <Name>{products.name}</Name>
          <Price>{products.price.toLocaleString()}원</Price>
        </ProductInfoWrapper>
        </>
      :<></>}
      <div style={{marginTop:"10rem",textAlign:"center"}}>
          {message}
      </div>
    </>
  );
};

export default ProductDetailPage;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const Title = styled.a`
  font-size: 48px;

  &:hover {
    cursor: pointer;
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 420px;
`;

const ProductInfoWrapper = styled.div`
  margin-top: 20px;
  padding: 0 20px;
`;

const Name = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const Price = styled.div`
  font-size: 18px;
  margin-top: 8px;
`;

const LoginTitle = styled.p`
  &:hover {
    cursor: pointer;
  }
`;