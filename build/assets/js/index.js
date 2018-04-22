var app5 = new Vue({
    el: '#app-5',
    data: {
        message: 'Hello Vue.js!',
        data:'你好，我是vue'
    },
    methods: {
        reverseMessage: function () {
            this.message = this.message.split('').reverse().join('')
        }
    }
})