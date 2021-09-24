import { render, h } from 'preact';
import { App } from './App';

const app = document.getElementById('app');
render(h(App, null), app);