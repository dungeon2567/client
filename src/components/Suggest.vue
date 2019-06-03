<template>
  <TextInput
    ref="input"
    :minimal="minimal"
    :value="query"
    @input="query = $event"
    @keydown="onKeyDown"
    @focus="onFocus"
    @blur="onBlur"
    :placeholder="value ? value.label : placeholder"
  >
    <Popover
      ref="itemsPopover"
      trigger="focus"
      @open="onShow"
      @close="onHide"
      placement="bottom-start"
    >
      <ul
        class="menu scroll-container"
        :style="{maxHeight: '300px'}"
      >
        <li
          :class="{'menu-item': true, 'disabled': true}"
          v-if="items.length === 0"
        >Sem Resultados</li>
        <li
          :class="{'menu-item': true, 'active': index === selectedIndex}"
          @click="onItemClick($event, item)"
          :key="item.id"
          v-for="(item, index) in items"
        >
          <pre v-html="renderHtml(item.label)" />
          </li>
      </ul>
    </Popover>
    <slot name="after">
      <Button slot="after" v-if="clearable" class="action minimal small" @click="clear">
        <i class="fas fa-times tag-remove"/>
      </Button>
    </slot>
  </TextInput>
</template>

<script>
import { throttle } from "../utils.js";

export default {
  props: {
    minimal: {
      type: Boolean,
      default: false
    },
    value: {
      type: null,
      default: null
    },
    clearable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ""
    },
    search: {
      type: Function,
      default: query => {
        return [];
      }
    }
  },
  data() {
    return {
      isOpen: false,
      query: "",
      items: [],
      dirt: false,
      selectedIndex: 0
    };
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        if (newVal != oldVal && (!this.$refs.input || !this.$refs.input.focused())) {
          this.query = newVal ? newVal.label : "";
        }
      },
      immediate: true
    },
    query: {
      handler(newVal, oldVal) {
        if (this.isOpen) {
          this.throttleSearch(newVal);
        }
      },
      immediate: true
    }
  },
  methods: {
    renderHtml(text) {
      return (
        "<b>" +
        text.substring(0, this.query.length) +
        "</b>" +
        text.substring(this.query.length)
      );
    },
    throttleSearch: throttle(async function(val) {
      try {
        this.items = await this.search(val);

        this.selectedIndex = 0;

        if (this.value !== null) {
          for (var it = 0; it < this.items.length; ++it) {
            var item = this.items[it];

            if (item.id === this.value.id) {
              this.selectedIndex = it;
              break;
            }
          }
        }
      } catch (err) {
        this.items = [];
      }
    }, 250),
    onShow() {
      this.isOpen = true;

      this.$emit("show");

      this.throttleSearch("");
    },
    onItemClick(event, item) {
      this.$emit("input", item);

      this.$refs.itemsPopover.close();
      this.query = item ? item.label : "";
    },
    clear() {
      this.query = "";
      this.value = null;
    },
    focus() {
      this.$refs.input.focus();
    },
    onKeyDown(e) {
      switch (e.keyCode) {
        case 13:
          {
            const item = this.items[this.selectedIndex];

            this.$emit("input", item);

            this.query = item ? item.label : "";

            this.$nextTick(() => {
              this.$refs.input.blur();
              this.$refs.itemsPopover.close();
            });
          }

          break;
        case 38:
          this.selectedIndex -= 1;

          if (this.selectedIndex < 0) {
            this.selectedIndex = this.items.length - 1;
          }

          e.preventDefault();
          break;
        case 40:
          this.selectedIndex += 1;

          if (this.selectedIndex >= this.items.length) {
            this.selectedIndex = 0;
          }

          e.preventDefault();
          break;
        case 8:
          if (this.query.length === 0) {
            this.$emit("remove");
          }
          break;
        case 9:
          this.$refs.itemsPopover.close();
          break;
        default:
          this.selectedIndex = 0;
          break;
      }
    },
    onHide() {
      this.isOpen = false;

      this.items = [];

      this.query = this.value ? this.value.label : "";

      this.$emit("hide");
    },
    onBlur() {
      this.$emit("blur");
    },
    onFocus() {
      this.query = "";
      this.$refs.itemsPopover.show();
    },
    selected(val) {
      this.$emit("input", val);
      this.$refs.itemsPopover.close();
    }
  }
};
</script>