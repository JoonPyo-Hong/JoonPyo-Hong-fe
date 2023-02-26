import React from 'react';
import styled from 'styled-components';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
import Link from 'next/link';

const Pagination = ({totalCount,nowPage}:{totalCount:number,nowPage:number}) => {
  
  let arr = [];
  let startPage = nowPage- (nowPage-1) % 5;
  let endPage = startPage + 5;
  let totalPage = Math.ceil(totalCount / 10);

  if (endPage > totalPage) endPage = totalPage + 1;

  for(var i = startPage; i < endPage; i++) {
      arr.push(i);
  }

  return (
    <Container>
      <Link href={`/?page=${startPage-1}`}>
      <Button disabled={startPage === 1}>    
        <VscChevronLeft/>      
      </Button>
      </Link>
      <PageWrapper>
        {arr.map((page) => (
            <Link key={page} href={`/?page=${page}`}>
              <Page selected={page === nowPage} disabled={page === nowPage} >      
                  {page}
              </Page>
            </Link>
        ))}        
      </PageWrapper>
      <Link href={`/?page=${endPage}`}>
      <Button disabled={endPage === totalPage + 1}>
          <VscChevronRight />
      </Button>
      </Link>
    </Container>
  );
};

export default Pagination;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 400px;
  margin-top: 40px;
  margin-left: -20px;
`;

const Button = styled.button`
  &:disabled {
    color: #e2e2ea;
    cursor: default;
  }

  &:not(:disabled):hover {
    cursor: pointer;
  }
`;

const PageWrapper = styled.div`
  display: flex;
  margin: 0 16px;
`;

type PageType = {
  selected: boolean;
};

const Page = styled.button<PageType>`
  padding: 4px 6px;
  background-color: ${({ selected }) => (selected ? '#000' : 'transparent')};
  color: ${({ selected }) => (selected ? '#fff' : '#000')};
  font-size: 20px;

  & + & {
    margin-left: 4px;
  }

  &:disabled {
    cursor: default;
  }

  &:not(:disabled):hover {
    cursor: pointer;
  }
`;
