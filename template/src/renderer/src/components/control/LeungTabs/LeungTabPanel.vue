<template>
  <transition name="fade-transform">
    <section
      v-show="isActive"
      ref="tab"
      :data-tab-id="computedId"
      :aria-hidden="!isActive"
      class="panel"
    >
      <slot />
    </section>
  </transition>
</template>

<script>
import { inject, watch, ref, computed, onBeforeMount, onBeforeUnmount } from 'vue'

export default {
  name: 'Tab',
  props: {
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const isActive = ref(false)

    const tabsProvider = inject('tabsProvider')
    const addTab = inject('addTab')
    const updateTab = inject('updateTab')
    const deleteTab = inject('deleteTab')

    const header = props.prefix + props.name + props.suffix
    const computedId = props.id ? props.id : props.name.toLowerCase().replace(/ /g, '-')
    const hash = computed(() => '#' + (!props.isDisabled ? computedId : ''))

    watch(
      () => tabsProvider.activeTabHash,
      () => {
        isActive.value = hash.value === tabsProvider.activeTabHash
      }
    )

    watch(
      () => Object.assign({}, props),
      () => {
        updateTab(computedId, {
          name: props.name,
          header: props.prefix + props.name + props.suffix,
          isDisabled: props.isDisabled,
          hash: hash.value,
          index: tabsProvider.tabs.length,
          computedId: computedId
        })
      }
    )

    onBeforeMount(() => {
      addTab({
        name: props.name,
        header: header,
        isDisabled: props.isDisabled,
        hash: hash.value,
        index: tabsProvider.tabs.length,
        computedId: computedId
      })
    })

    onBeforeUnmount(() => {
      deleteTab(computedId)
    })

    return {
      header,
      computedId,
      hash,
      isActive
    }
  }
}
</script>
<style scoped lang="less">
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-100%);
}
.fade-transform-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.fade-transform-enter-active {
  transition: all 0.4s ease-in-out;
}
.fade-transform-leave {
  opacity: 1;
  transform: translateX(0);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.fade-transform-leave-active {
  transition: all 0.4s ease-in-out;
}
.panel {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
