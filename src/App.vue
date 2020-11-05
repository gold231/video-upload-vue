<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style>
#app {
  font-family: "Times New Roman", Times, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.modal-body {
  font-family: "Times New Roman", Times, serif;
}
.modal-footer {
  display: none !important;
}
table {
  position: relative;
  z-index: 10;
}
.btn:focus {
  box-shadow: none !important;
}
</style>
