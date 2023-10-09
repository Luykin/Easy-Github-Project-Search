import classNames from 'classnames';
import * as Sentry from '@sentry/react';
import * as R from 'ramda';
import style from './index.module.scss';
import { Input, List, message, Pagination, Spin } from 'antd';
import { useGithubProject } from '../../hooks/useGithubApi';
import { useEffect, useRef, useState } from 'react';
import _ from 'lodash';

const { Search } = Input;
const HOME_PAGE_SIZE = 20;

function HomePage() {
  const [inputName, setInputName] = useState('');
  const [inputNameForSearch, setInputNameForSearch] = useState('');
  const scrollDomRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const changeInputNameForSearch = useRef<Function>();
  const { data: projectRet, isFetching: isFetchProject, isError } = useGithubProject(inputNameForSearch, page, HOME_PAGE_SIZE);
  const projectList = R.pathOr([], ['items'], projectRet)
  const projectListTotalCount = R.pathOr(0, ['total_count'], projectRet)
  useEffect(() => {
    changeInputNameForSearch.current = _.debounce((v: string) => {
      setInputNameForSearch(v)
    }, 1200);
  }, []);

  function scrollToTop() {
    scrollDomRef.current && scrollDomRef.current.scrollTo(0, 0);
  }

  useEffect(() => {
    if (isError) {
      message.error("Load Failed, Please try again later.")
    }
  }, [isError])

  return (
    <div className={classNames(style.mainContainer, 'beautiful-scrollbar')}>
      <h1 className={style.title}>Github Project Search</h1>
      <Search value={inputName} className={style.searchInput} placeholder="search project" enterButton="Search" size="large" loading={isFetchProject}
        onInput={(e) => {
          scrollToTop();
          const v = R.pathOr('', ['target', 'value'], e)
          setInputName(v);
          changeInputNameForSearch.current && changeInputNameForSearch.current(v);
        }}
        onPressEnter={(e) => {
          scrollToTop();
          setInputNameForSearch(inputName)
        }}
      />
      {inputNameForSearch && projectList ?
        <>
          <div className={classNames(style.homeListWrap, 'beautiful-scrollbar', isFetchProject ? style.loadingHLW : null)} ref={scrollDomRef}>
            <List
              className={classNames(style.homeList)}
              dataSource={projectList}
              locale={{ emptyText: isFetchProject ? 'Loading...' : isError ? 'Load Failed' : 'No Data' }}
              renderItem={(item, index) => {
                const fullName = R.pathOr('', ['full_name'], item)
                const htmlUrl = R.pathOr('', ['html_url'], item)
                const description = R.pathOr('', ['description'], item)
                // const language = R.pathOr('', ['language'], item)
                return <List.Item>
                  <div className={style.projectInfoWrap}>
                    <a href={htmlUrl} target={'_blank'} className={style.projectName}><span>{fullName}</span></a>
                    <span className={style.projectDes}>{description}</span>
                  </div>
                </List.Item>
              }}
            />
            <Spin spinning={isFetchProject} className={style.listSpin} />
          </div>
          <Pagination onChange={(page, pageSize) => {
            scrollToTop();
            setPage(page)
          }} className={style.pagination} current={page} total={projectListTotalCount} pageSize={HOME_PAGE_SIZE} showSizeChanger={false} />
        </>
        : <></>}
    </div>
  );
}

export default Sentry.withErrorBoundary(HomePage, {
  fallback: (
    <p className="w-full h-full text-xl">
      Sorry, an unrecoverable error has occurred. Please reload the page.
    </p>
  ),
  showDialog: true,
});
