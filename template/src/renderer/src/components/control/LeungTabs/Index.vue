<template>
  <div class="leung-tabs">
    <div class="panels">
      <slot />
    </div>
    <div class="tabs">
      <canvas id="tabs-canvas" style="position: absolute; z-index: -1; left: 0"></canvas>
      <div v-for="(tab, i) in tabs" :key="i" class="tab">
        <a
          class="tab-link"
          :class="{ 'tab-active': tab.hash == activeTabHash }"
          @click="toggleNav(tab, $event)"
        >
          {{ tab.header }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, provide, onMounted, onUnmounted, toRefs } from 'vue'
import { NavCanvas } from './nav-canvas'
import { debounce } from 'lodash-es'
export default {
  props: {
    cacheLifetime: {
      type: Number,
      default: 5
    },
    options: {
      type: Object,
      required: false,
      default: () => ({
        useUrlFragment: true,
        defaultTabHash: null
      })
    },
    initNumber: {
      type: Number,
      default: 0
    }
  },

  emits: ['changed', 'clicked'],

  setup(props, context) {
    const state = reactive({
      activeTabHash: '',
      lastActiveTabHash: '',
      tabs: []
    })

    provide('tabsProvider', state)

    provide('addTab', (tab) => {
      state.tabs.push(tab)
    })

    provide('updateTab', (computedId, data) => {
      let tabIndex = state.tabs.findIndex((tab) => tab.computedId === computedId)

      data.isActive = state.tabs[tabIndex].isActive

      state.tabs[tabIndex] = data
    })

    provide('deleteTab', (computedId) => {
      let tabIndex = state.tabs.findIndex((tab) => tab.computedId === computedId)
      state.tabs.splice(tabIndex, 1)
    })

    let nc = null
    const toggleNav = (tab, event) => {
      if (event) {
        event.preventDefault()
      }
      if (state.lastActiveTabHash === tab.hash) {
        context.emit('clicked', { tab: tab })
        return
      }
      state.tabs.forEach((tab) => {
        tab.isActive = tab.hash === tab.hash
      })
      context.emit('changed', { tab: tab })
      state.lastActiveTabHash = state.activeTabHash = tab.hash
      if (nc) {
        state.activeTabHash = tab.hash
        nc.toggle(tab.index)
      }
    }

    const debNavResize = debounce(() => {
      if (nc) {
        nc.resize()
      }
    }, 500)

    onMounted(() => {
      if (state.tabs.length > 0) {
        toggleNav(state.tabs[props.initNumber])
        nc = new NavCanvas('tabs-canvas', '.tabs .tab', props.initNumber)
      }
      window.addEventListener('resize', debNavResize)
      console.log(state.tabs)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', debNavResize)
    })

    return {
      ...toRefs(state),
      toggleNav
    }
  }
}
</script>
<style scoped lang="less">
.leung-tabs {
  width: 100%;
  height: calc(100% - 20px);
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  background: rgb(3, 22, 44);
  padding-bottom: 20px;
  .panels {
    flex: 1;
  }
  .tabs {
    z-index: 10;
    display: flex;
    position: sticky;
    width: calc(100% - 800px);
    user-select: none;
    justify-content: center;
    padding: 0 400px;
    .tab {
      text-align: center;
      width: 340px;
      .tab-link {
        transition: color 0.2s;
        text-decoration: none !important;
        color: #b9c2cc;
        flex: 1;
        // width: auto;
        // min-width: 140px;
        line-height: 60px;
        font-size: 24px;
        text-align: center;
        cursor: pointer;
        // padding: 0 50px;
        &:hover {
          color: #fff !important;
        }
        &.tab-active {
          color: #fff !important;
        }
      }
    }
  }
}
</style>
