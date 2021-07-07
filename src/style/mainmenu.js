import styled from 'styled-components'

export const MainMenu = styled.div`
  .desktop {
    border-right: 2px solid #EAEAEA;
    position: fixed;
    height: 100%;
    .logo {
      padding-left: 16px;
      padding-top: 23px;
      margin-bottom: 20px;
      img {
        width: 48px;
        height: auto;
      }
    }
    .pro-sidebar>.pro-sidebar-inner>.pro-sidebar-layout {
      overflow-y: hidden;
    }
    .pro-sidebar .pro-menu .pro-menu-item {
      zoom: 1.3;
    }
    .pro-sidebar .pro-menu .pro-menu-item > .pro-inner-item {
      display: block;
      padding: 0;
    }
    .pro-sidebar .pro-menu .pro-menu-item > .pro-inner-item > .pro-icon-wrapper .pro-icon {
      height: auto;
    }
    .pro-sidebar .pro-menu .pro-menu-item > .pro-inner-item > .pro-icon-wrapper {
      margin-right: 0;
      line-height: normal;
    }
    .pro-sidebar .pro-menu .pro-menu-item > .pro-inner-item {
      text-align: center;
    }
    .mainiconmenu {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.34);
    }
    .pro-icon svg {
      margin-top: 3px;
    }
    .active.pro-menu-item .menu-title {
      color: white;
      /* color: #F9A01B; */
    }
    .menu-title {
      font-size: 8px;
      /* color: rgba(0, 0, 0, 0.34); */
      color: white;
      font-family:'Roboto';
      position: relative;
      bottom: 10px;
    }
    .pro-sidebar > .pro-sidebar-inner > .pro-sidebar-layout .pro-sidebar-header {
      border-bottom: unset;
    }
    .pro-sidebar > .pro-sidebar-inner {
      /* background: #FFFFFF; */
      background: rgb(65, 174, 169);
    }
    .pro-sidebar .pro-menu.shaped .pro-menu-item > .pro-inner-item > .pro-icon-wrapper {
      background: #2b2b2b00;
    }
    .pro-sidebar.collapsed .pro-menu > ul > .pro-menu-item::before {
      border-radius: 8px;
      width: 48px;
      height: 48px;
      margin: auto;
      
    }
    .pro-sidebar.collapsed .pro-menu > ul > .active.pro-menu-item::before {
      background: #F9A01B;
      opacity: 0.12;
    }
  }
  .mobile {
    /* background: #2F2F2F; */
    /* padding-right: 30px; */
    /* position: fixed; */
    /* height: 100%; */
    /* height: ${props => `${props.screenHeight}px`}; */
    /* z-index: 101; */
    /* width: 286px; */
    .shiftMiddle {
      /* position: relative;
      top: 15%; */
    }
    span.menuTriggerIcon {
      position: absolute;
      left: 20px;
      top: 20px;
      z-index: 1;
    }
    .ant-menu {
      color: rgba(255,255,255,0.7);
    }
    .ant-menu.ant-menu-sub {
      background: unset;
    }
    .pro-sidebar > .pro-sidebar-inner {
      background: #2F2F2F;
    }
    .pro-sidebar .pro-menu .pro-menu-item > .pro-inner-item {
      padding: 0;
    }
    .ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left {
      border-right: unset;
    }
    svg.menuicon {
      position: relative;
      top: 5px;
    }
    span.menutitle {
      margin-left: 16px;
    }
    li.ant-menu-item a {
      color: rgba(255, 255, 255, 0.7);
      font-family: Roboto;
      font-size: 16px;
    }
    .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
      background: rgba(255, 255, 255, 0.08);
    }
  
    .ant-menu-vertical .ant-menu-item::after,
    .ant-menu-vertical-left .ant-menu-item::after,
    .ant-menu-vertical-right .ant-menu-item::after,
    .ant-menu-inline .ant-menu-item::after {
      border-right: 3px solid #FFFFFF;
    }
    .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected a{
      color: #FFFFFF;
    }
    ul.ant-menu.ant-menu-light.ant-menu-root.ant-menu-inline {
      background: #2F2F2F;
    }
    li.ant-menu-item.menulogoitem {
      height: auto;
    }
    .menulogout {
      color: rgba(255, 255, 255, 0.7);
      font-size: 16px;
      font-family: Roboto;
      padding: 10px;
      /* position: absolute;
      bottom: 21px; */
      /* bottom: calc(25% + 21px); */
      /* left: 30px; */
      span.menu-title {
        margin-left: 16px;
      }
    }
    .logo {
      padding-left: 16px;
      padding-top: 30px;
      margin-bottom: 20px;
      img {
        width: 48px;
        height: auto;
      }
    }

  }
`