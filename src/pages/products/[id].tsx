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
    })
    .catch(function (error) {
      console.log(error);
      setUserName("");
      
    });
  }
  
  const logOut = () => {
    setUser(null);
    setUserName("");
  };

  useEffect(() => {
    if(router.query.id){
      getProduct();
    }
  }, [page])
  useEffect(() => {
    if(user){
      getUserName();
    }
  }, [])
  
  return (
    <>
      <Header>
        <Link href='/'>
          <Title>HAUS</Title>
        </Link>
        {userName ?
          <div>
            <p>
              {userName}
            </p>
            <p onClick={logOut}>
              logout
            </p>
          </div> 
          : 
          <>
            <Link href='/login'>
              <p>login</p>
            </Link>
        </>
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
