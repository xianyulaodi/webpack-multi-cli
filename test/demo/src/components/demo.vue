<template>
  <div class="page-index">
    <p class="logo"></p>
    <p class="text">{{ text }}</p>
  </div>
</template>
 
  
 
<script>
  export default {
    name: "index",
  
    data() {
      return {
        text: ''
      };
    },
  
    created() {
      this.getText();
    },
  
    methods: {
      getText: function() {
        this.$http.post("/test", "type=top&key=123456").then(res => {
          this.text = res.data.text;
        });
      }
    }
  };
</script>
 
  
 
<style scoped>
  .page-index {
    margin-top: 20px;
    font-size: 30px;
  }
  .logo {
    width: 200px;
    height: 100px;
    margin: auto;
    background: url('~assets/logo.png') no-repeat center top;
    background-size: 50% 50px;
  }
</style>