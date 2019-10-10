import Body from './app/bodys/body/layout/Body'
import Basic from './app/bodys/body/components/report/Basic'
import DetailNotice from './app/bodys/body/components/notice/DetailNotice'
import Notice from './app/bodys/body/components/notice/Notice'
import Glossary from './app/bodys/body/components/glossary/Glossary'
import Overview from './app/bodys/body/components/dashboard/Overview'
import Realtime from './app/bodys/body/components/dashboard/Realtime'
import NoDeployLog from './app/bodys/body/error/NoDeployLog'
import NoServiceCategory from './app/bodys/body/error/NoServiceCategory'
import PageNotFound from './app/bodys/body/error/PageNotFound'
import NoData from './app/bodys/body/error/NoData'
import NoPermission from './app/bodys/body/error/NoPermission'
import NoProject from './app/bodys/body/error/NoProject'
import Preview from './app/bodys/body/components/report/Preview'

export const routes = [
  {
    path: '/',
    component: Body,
    children: [
      { path: 'report/:projectId', name: 'basic', component: Basic },
      { path: 'overview/:projectId', name: 'overview', component: Overview },
      { path: 'realtime/:projectId', name: 'realtime', component: Realtime }
    ]
  },
  { path: '/preview', name: 'preview', component: Preview },
  { path: '/notice', name: 'Notice', component: Notice },
  { path: '/notice/:noticeId', name: 'Notice.edit', component: DetailNotice },
  { path: '/glossary', name: 'Glossary', component: Glossary },
  {
    path: '/no-deploy-log',
    name: 'NoDeployLog',
    component: NoDeployLog
  },
  {
    path: '/no-category',
    name: 'NoCategory',
    component: NoServiceCategory
  },
  {
    path: '/no-permission',
    name: 'NoPermission',
    component: NoPermission
  },
  {
    path: '/no-project',
    name: 'NoProject',
    component: NoProject
  },
  {
    path: '/page-not-found',
    name: 'PageNotFound',
    component: PageNotFound
  },
  {
    path: '/no-data',
    name: 'NoDataPage',
    component: NoData
  },
  {
    path: '*',
    redirect: '/page-not-found'
  }
]
