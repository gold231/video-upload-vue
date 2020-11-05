<template>
  <b-card class="col-xl-5 login">
    <b-card-body>
      <form v-show="login">
        <p class="h2 text-center py-4">Sign in</p>
        <div class="text-left">
          <b-input-group class="mb-2">
            <b-input-group-prepend is-text>
              <b-icon icon="person-fill"></b-icon>
            </b-input-group-prepend>
            <b-form-input type="text" :placeholder="'Email'" v-model="email">
            </b-form-input>
          </b-input-group>
          <label class="mb-3 message">{{ validation.firstError("email") }}</label>
          <b-input-group class="mb-2">
            <b-input-group-prepend is-text>
              <b-icon icon="lock-fill"></b-icon>
            </b-input-group-prepend>
            <b-form-input
              type="password"
              :placeholder="'Password'"
              v-model="password"
            >
            </b-form-input>
          </b-input-group>
          <label class="mb-3 message">{{ validation.firstError("password") }}</label>
        </div>
        <div class="google-btn" @click="signInWithGoogle">
          <div class="google-icon-wrapper">
            <img
              class="google-icon"
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            />
          </div>
          <p class="btn-text"><b>Log in with google</b></p>
        </div>
        <div class="text-center py-4 mt-3">
          <b-button variant="success" @click="signinsubmit">Sign in</b-button>
        </div>
        <b-link class="float-right" @click="login = false; init();">Sign up</b-link>
      </form>
      <form v-show="!login">
        <p class="h2 text-center py-4">Sign up</p>
        <b-input-group class="mb-2">
          <b-input-group-prepend is-text>
            <b-icon icon="info-circle-fill"></b-icon>
          </b-input-group-prepend>
          <b-form-input type="text" :placeholder="'Name'" v-model="fullname" />
        </b-input-group>
        <label class="mb-3 message">{{ validation.firstError("fullname") }}</label>
        <div class="text-left">
          <b-input-group class="mb-2">
            <b-input-group-prepend is-text>
              <b-icon icon="person-fill"></b-icon>
            </b-input-group-prepend>
            <b-form-input type="text" :placeholder="'Email'" v-model="email" />
          </b-input-group>
          <label class="mb-3 message">{{ validation.firstError("email") }}</label>
          <b-input-group class="mb-2">
            <b-input-group-prepend is-text>
              <b-icon icon="lock-fill"></b-icon>
            </b-input-group-prepend>
            <b-form-input
              type="password"
              :placeholder="'Password'"
              v-model="password"
            />
          </b-input-group>
          <label class="mb-3 message">{{ validation.firstError("password") }}</label>
        </div>
        <div class="text-center py-4 mt-3">
          <b-button variant="success" @click="signupsubmit">Sign up</b-button>
        </div>
        <b-link class="float-right" @click="login = true; init();">Sign in</b-link>
      </form>
    </b-card-body>
  </b-card>
</template>

<script>
import Vue from "vue";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
Vue.use(SimpleVueValidation);

import firebase from "firebase";
import { users } from "../firebase";

export default {
  name: "Credential",
  data() {
    return {
      login: true,
      email: "",
      password: "",
      fullname: "",
      spinning: false
    };
  },
  validators: {
    email: function(value) {
      return Validator.value(value)
        .required()
        .email();
    },
    password: function(value) {
      return Validator.value(value).required();
    },
    fullname: function(value) {
      if (this.login == true) {
        return;
      }
      return Validator.value(value).required();
    }
  },
  components: {},
  mounted() {
    localStorage.setItem("location", "");
    this.init();
  },
  methods: {
    init() {
      this.fullname = "";
      this.email = "";
      this.password = "";
    },    
    signInWithGoogle() {
      let vm = this;
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          // var token = result.credential.accessToken;
          // console.log(token);
          var user = result.user;
          localStorage.setItem("username", user.displayName);
          localStorage.setItem("useremail", user.email);
          let data = {
            fullname: user.displayName,
            email: user.email,
          };
          users
            .orderByChild("email")
            .equalTo(user.email)
            .on("value", snap => {
              if (snap.val() == null) {
                users.push(data);
              }
            });
          vm.$router.push("/gallery");
        })
        .catch(error => {
          //var errorCode = error.code;
          var errormessage = error.message;
          console.log(errormessage);
        });
    },
    signinsubmit() {
      let vm = this;
      this.$validate().then(function(success) {
        if (success) {
          users
            .orderByChild("email")
            .equalTo(vm.email)
            .on("value", snap => {
              if (snap.val() == null) {
                vm.$bvToast.toast("Email or Password is incorrect!", {
                  title: "Credential",
                  variant: "danger",
                  solid: true,
                  toaster: "b-toaster-top-right"
                });
                vm.init();
              } else {
                users
                  .orderByChild("password")
                  .equalTo(vm.password)
                  .on("value", snap => {
                    if (snap.val() == null) {
                      vm.$bvToast.toast("Email or Password is incorrect!", {
                        title: "Credential",
                        variant: "danger",
                        solid: true,
                        toaster: "b-toaster-top-right"
                      });
                      vm.init();
                    } else {
                      localStorage.setItem("username", vm.fullname);
                      localStorage.setItem("useremail", vm.email);
                      vm.$router.push("/gallery");
                    }
                  });
              }
            });
        }
      });
    },
    signupsubmit() {
      let vm = this;
      this.$validate().then(function(success) {
        if (success) {
          let data = {
            fullname: vm.fullname,
            email: vm.email,
            password: vm.password
          };
          users
            .orderByChild("email")
            .equalTo(vm.email)
            .once("value", snap => {
              if (snap.val() != null) {
                vm.$bvToast.toast("This email was used already", {
                  title: "Credential",
                  variant: "danger",
                  solid: true,
                  toaster: "b-toaster-top-right"
                });
              } else {
                users.push(data);                
                vm.$bvToast.toast("Registered successfully", {
                  title: "Credential",
                  variant: "success",
                  solid: true,
                  toaster: "b-toaster-top-right"
                });
                localStorage.setItem("username", vm.fullname);
                localStorage.setItem("useremail", vm.email);
                vm.$router.push("/gallery");                
              }
            });
        }
      });
    }    
  }
};
</script>
<style lang="scss" scoped>
.card {
  border: none !important;
}
.login {
  margin: auto;
  margin-top: 40px;
  background-color: rgba(255, 255, 255, 0.8) !important;
}
span.term {
  color: #007bff;
}
.termlink {
  text-decoration: underline;
}
button {
  padding: 10px 40px !important;
}
.fas {
  color: #9c27b0;
}
.input-group-text .b-icon.bi {
  color: #9c27b0;
}
.error,
.error:focus {
  border-color: #f66;
}
.message {
  color: #f66;
  display: block;
  text-align: left;
  margin-left: 40px;
}

$white: #fff;
$google-blue: #4285f4;
$button-active-blue: #1669f2;

.google-btn {
  width: 184px;
  height: 42px;
  background-color: $google-blue;
  border-radius: 2px;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.25);
  margin: auto;
  margin-top: 40px;
  .google-icon-wrapper {
    position: absolute;
    margin-top: 1px;
    margin-left: 1px;
    width: 40px;
    height: 40px;
    border-radius: 2px;
    background-color: $white;
  }
  .google-icon {
    position: absolute;
    margin-top: 11px;
    margin-left: -10px;
    width: 18px;
    height: 18px;
  }
  .btn-text {
    float: right;
    margin: 11px 11px 0 0;
    color: $white;
    font-size: 14px;
    letter-spacing: 0.2px;
    font-family: "Roboto";
  }
  &:hover {
    box-shadow: 0 0 6px $google-blue;
    cursor: pointer;
  }
  &:active {
    background: $button-active-blue;
  }
}

@media (max-width: 767px) {
  .login {
    width: 90% !important;
  }
}
@media (min-width: 767px) and (max-width: 1200px) {
  .login {
    width: 80% !important;
  }
}
</style>
