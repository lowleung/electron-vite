<template>
  <div class="wrapper">
    <div class="backgroundImg">
      <img :src="background" alt="" />
    </div>
    <div class="leftSharp"></div>
    <div class="rightSharp"></div>
    <div class="imgs">
      <div v-for="item in imgs" :key="item" class="img">
        <img :src="item" alt="" />
      </div>
    </div>
    <div class="arrows">
      <div class="arrow"></div>
      <div class="arrow"></div>
      <div class="arrow"></div>
    </div>
    <div class="content">
      <img :src="logo" alt="" class="logo" />
      <div class="_arrows">
        <div class="_arrow"></div>
        <div class="_arrow"></div>
        <div class="_arrow"></div>
      </div>
      <div class="line"></div>
      <div class="name" v-text="title"></div>
      <div class="project" v-text="subTitle"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeungPage1',
  props: {
    background: String,
    logo: String,
    imgs: Array,
    title: String,
    subTitle: String
  },
  methods: {}
}
</script>
<style scoped lang="less">
.wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .leftSharp {
    position: absolute;
    border-radius: 100px;
    top: -16px;
    left: -517px;
    width: 1000px;
    height: 1800px;
    transform: rotateZ(33deg) skewX(6deg);
    background: #309a99;
  }
  .rightSharp {
    position: absolute;
    border-radius: 100px;
    top: 200px;
    right: -293px;
    width: 500px;
    height: 900px;
    transform: rotateZ(34deg) skewX(7deg);
    background: #309a99;
    box-shadow: 0 0 50px gray;
  }
  .backgroundImg {
    position: absolute;
    border-radius: 100px;
    top: -40px;
    left: -430px;
    width: 1000px;
    height: 1800px;
    transform: rotateZ(33deg) skewX(6deg);
    overflow: hidden;
    img {
      position: absolute;
      top: -200px;
      right: -400px;
      height: 1280px;
      transform: rotateZ(-33deg) skewX(-6deg);
    }
  }
  .imgs {
    position: absolute;
    width: 900px;
    height: 195px;
    left: 954px;
    top: 57px;
    display: flex;
    justify-content: space-between;
    .img {
      width: 280px;
      height: 195px;
      transform: skewX(-25deg);
      overflow: hidden;
      position: relative;
      img {
        position: absolute;
        min-width: 400px;
        min-height: 240px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) skewX(25deg);
      }
    }
  }

  @keyframes animate {
    0% {
      opacity: 0;
      transform: translateX(-28px);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(28px);
    }
  }
  .arrows {
    position: absolute;
    height: 52px;
    width: 135px;
    left: 730px;
    top: 126px;
    display: flex;
    .arrow {
      position: relative;
      flex: 1;
      animation: animate 2s infinite;
      &:after {
        content: '';
        display: block;
        width: 20px;
        height: 24px;
        background: #309a99;
        transform: skewX(-43deg);
        position: absolute;
        left: 50%;
        top: 50%;
        transform-origin: 0 0%;
        z-index: 0;
      }
      &:before {
        content: '';
        display: block;
        width: 20px;
        height: 24px;
        background: #309a99;
        transform: skewX(43deg);
        position: absolute;
        left: 50%;
        top: calc(50% - 24px);
        transform-origin: 100% 100%;
      }
      &:nth-child(1) {
        animation-delay: 0s;
      }
      &:nth-child(2) {
        animation-delay: -0.1s;
      }
      &:nth-child(3) {
        animation-delay: -0.2s;
      }
    }
  }
  .content {
    width: 100%;
    height: 100%;
    .logo {
      position: absolute;
      width: 160px;
      height: 160px;
      left: 180px;
      top: 190px;
    }
    ._arrows {
      position: absolute;
      height: 52px;
      width: 135px;
      left: 45px;
      top: 510px;
      display: flex;
      ._arrow {
        position: relative;
        flex: 1;
        &:after {
          content: '';
          display: block;
          width: 20px;
          height: 24px;
          background: white;
          transform: skewX(-43deg);
          position: absolute;
          left: 50%;
          top: 50%;
          transform-origin: 0 0%;
          z-index: 0;
        }
        &:before {
          content: '';
          display: block;
          width: 20px;
          height: 24px;
          background: white;
          transform: skewX(43deg);
          position: absolute;
          left: 50%;
          top: calc(50% - 24px);
          transform-origin: 100% 100%;
        }
      }
    }
    .line {
      position: absolute;
      height: 5px;
      width: 470px;
      background: white;
      left: 190px;
      top: 536px;
    }
    .name {
      font-size: 36px;
      color: white;
      position: absolute;
      width: 480px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      left: 185px;
      top: 470px;
    }
    .project {
      font-size: 24px;
      color: white;
      position: absolute;
      width: 480px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      left: 185px;
      top: 550px;
    }
  }
}
</style>
