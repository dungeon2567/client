<script>
import Button from "./components/Button.vue";
import CollapsibleList from "./components/CollapsibleList.vue";
import Logo from "./assets/logo.png";

export default {
  data() {
    return {
      isOpen: true,
      window: {
        width: 0,
        height: 0,
        username: ""
      }
    };
  },
  mounted() {
    this.username = localStorage.getItem("username");

    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  render(h) {
    return (
      <div id="app" class="root">
        <div class="navbar">
          <Button class="minimal" onClick={() => (this.isOpen = !this.isOpen)}>
            <div class={{ "menu-icon": true, icon: true, opened: this.isOpen }}>
              <div />
              <div />
              <div />
            </div>
          </Button>
        </div>
        <div class="body">
          <transition name="sidebar">
            <div
              class={{ sidebar: true, mobile: this.window.width < 1024 }}
              v-show={this.isOpen}
            >
              <img
                src={Logo}
                alt="Avatar"
                style="width: 100%; padding-left: 50px; padding-right: 50px;"
              />
              <CollapsibleList>
                <template slot="header">CRUD</template>
                <ul class="menu">
                  <router-link
                    to="/grower"
                    tag="li"
                    class="menu-item"
                    exact-active-class="active"
                    exact
                  >
                    <i class="fas fa-shopping-cart icon" />
                    <span>Grower</span>
                  </router-link>
                  <router-link
                    to="/properties"
                    tag="li"
                    class="menu-item"
                    exact-active-class="active"
                    exact
                  >
                    <i class="fas fa-cogs icon" />
                    <span>Properties</span>
                  </router-link>
                </ul>
              </CollapsibleList>
              <div class="divider vertical" />
              <ul class="menu">
                <router-link
                  to="/qrcode-scanner"
                  tag="li"
                  class="menu-item"
                  exact-active-class="active"
                  exact
                >
                  <i class="fas fa-qrcode icon" />
                  <span>QRCode Scanner</span>
                </router-link>
              </ul>
            </div>
          </transition>
          <div class={{ content: true, isOpen: this.isOpen }}>
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
          </div>
        </div>
        <transition name="backdrop">
          {this.window.width < 1024 && this.isOpen && (
            <div class="backdrop" onClick={() => (this.isOpen = false)} />
          )}
        </transition>
      </div>
    );
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    }
  }
};
</script>

<style>
.root > .body {
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: row;
}

.content {
  flex-grow: 1;
  position: relative;
  height: 100%;
  overflow: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-timing-function: ease;
  transition-duration: 175ms;
  opacity: 1;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.sidebar {
  flex-shrink: 0;
  background: #fff;
  z-index: 20;
  padding: 8px;
  min-height: 100%;
  position: relative;
  width: 220px;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);

  margin-left: 0px;
  position: relative;
  transition: margin-left 0.75s ease;
}

.sidebar.mobile {
  position: fixed;
}

.sidebar-enter,
.sidebar-leave-to {
  margin-left: -220px;
}
</style>
