
import "./assets/css/vendor/bootstrap.min.css";

let render = () => {
  import('./assets/css/sass/themes/theblack-theme.scss').then(x => {
     require('./AppRenderer');
  });
};
render();