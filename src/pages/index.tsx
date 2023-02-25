import { useRouter } from 'next/router';
import Link from 'next/link';
import type { NextPage } from 'next';
import styled from 'styled-components';

// import products from '../api/data/products.json';
import ProductList from '../components/ProductList';
import Pagination from '../components/Pagination';
import React, { useState,useEffect}  from 'react';
import axios from 'axios';
import {useRecoilState} from "recoil";
import { userState } from '../recoil/user';

const HomePage: NextPage = () => {
  
  const router = useRouter();

  const [user,setUser]= useRecoilState(userState);
  const [userName, setUserName] = useState("");
  
  const { page } = router.query;
  const [totalPage, setTotalPage] = useState(0);

  const [product, setProduct] = useState([]);
  const [message, setMessage] = useState("");

  const getProduct = async () => {
    axios.get(`https://api.sixshop.com/products?page=${ (page ? Number(page) : 1)}&size=10`)
    .then(function (response) {
      setTotalPage(response.data.data.totalCount);
      setProduct(response.data.data.products);
      setMessage("");
    })
    .catch(function (error) {
      console.log(error);
      setMessage("존재하지 않는 페이지입니다.");
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

  const pagebarView = () => {
    if(totalPage){    
      return <div><ProductList products={product} /><Pagination totalCount={totalPage} nowPage={(page ? Number(page) : 1)} /></div>    
    }
  };

  const logOut = () => {
    if(confirm("로그아웃 하시겠습니까?")){
      setUser(null);
      setUserName("");
    }
  };
  
  useEffect(() => {
    if(user){
      getUserName();
    }
  }, [])

  useEffect(() => {
    if(!isNaN(Number(page))||router.asPath=="/" ){
      getProduct();
      setMessage("");
    }else if(page !=undefined){
      setMessage("존재하지 않는 페이지입니다.");
    }
  },[page])

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
      <Container>
        {pagebarView()}
        {message && <div style={{marginTop:"10rem"}}>
          {message}
        </div>}
      </Container>

    </>
  );
};

export default HomePage;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const Title = styled.a`
  font-size: 48px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 40px;
`;
