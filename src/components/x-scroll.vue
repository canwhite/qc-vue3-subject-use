<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<template>
  <div class="mouse-wheel-pulldown">
    <div ref="scroll" class="pulldown-wrapper">
      <div class="pulldown-content">
        <div class="pulldown-tips">
          <div v-show="beforePullDown">
            <span>Pull Down and refresh</span>
          </div>
          <div v-show="!beforePullDown">
            <div v-show="isPullingDown">
              <span>Loading...</span>
            </div>
            <div v-show="!isPullingDown"><span>Refresh success</span></div>
          </div>
        </div>
        <ul class="pulldown-list">
          <li v-for="i of dataList" :key="i" class="pulldown-list-item">
            {{ `I am item ${i} ` }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import BScroll from '@better-scroll/core'
  import PullDown from '@better-scroll/pull-down'
  import MouseWheel from '@better-scroll/mouse-wheel'

  BScroll.use(PullDown)
  BScroll.use(MouseWheel)

  function generateData() {
    const BASE = 30
    const begin = BASE * STEP
    const end = BASE * (STEP + 1)
    let ret = []
    for(let i = end; i > begin; i--) {
      ret.push(i)
    }
    return ret
  }

  const TIME_BOUNCE = 800
  const TIME_STOP = 600
  const REQUEST_TIME = 1000
  const THRESHOLD = 20 //触发刷新的具体
  const STOP = 30 //停止回弹的具体
  let STEP = 0

  export default {
    data() {
      return {
        beforePullDown: true,
        isPullingDown: false,
        dataList: generateData()
      }
    },
    mounted() {
      this.initBscroll()
    },
    methods: {
      initBscroll() {
        this.bscroll = new BScroll(this.$refs.scroll, {
          scrollY: true,
          bounceTime: TIME_BOUNCE,//弹跳时间
          mouseWheel: true,
          pullDownRefresh: {
            threshold: THRESHOLD,
            stop: STOP
          }
        })

        //钩子监听
        this.bscroll.on('pullingDown', this.pullingDownHandler)
        this.bscroll.on('scroll', this.scrollHandler)
        // eslint-disable-next-line no-unused-vars
        this.bscroll.on('scrollEnd', (e) => {
          console.log('scrollEnd')
        })
      },
      scrollHandler(pos) {
        console.log(pos.y)
      },
      async pullingDownHandler() {
        console.log('trigger pullDown')
        this.beforePullDown = false
        this.isPullingDown = true
        STEP += 1

        //数据请求在这个部分
        await this.requestData()

        this.isPullingDown = false
        this.finishPullDown()
      },
      async finishPullDown() {
        const stopTime = TIME_STOP
        await new Promise(resolve => {
          setTimeout(() => {
            this.bscroll.finishPullDown()
            resolve()
          }, stopTime)
        })
        setTimeout(() => {
          this.beforePullDown = true
          this.bscroll.refresh()
        }, TIME_BOUNCE)
      },

      /** 数据请求部分 */
      async requestData() {
        try {
          const newData = await this.ajaxGet(/* url */)
          this.dataList = newData.concat(this.dataList)
        } catch (err) {
          // handle err
          console.log(err)
        }
      },
      ajaxGet(/* url */) {
        return new Promise(resolve => {
          setTimeout(() => {
            const dataList = generateData()
            resolve(dataList)
          }, REQUEST_TIME)
        })
      }
    }
  }
</script>
<style  scoped>
.mouse-wheel-pulldown
{
  height: 100%
}

.pulldown-wrapper{
  position: relative;
  height: 100%;
  padding: 0 10px;
  border: 1px solid #ccc;
  overflow: hidden;
}
.pulldown-list{
  padding: 0
}
    
.pulldown-list-item{
  padding: 10px 0;
  list-style: none;
  border-bottom: 1px solid #ccc
}
.pulldown-tips{
  position: absolute;
  width:100%;
  padding: 20px;
  box-sizing: border-box;
  transform: translateY(-100%) translateZ(0);
  text-align: center;
  color: #999
}
</style>