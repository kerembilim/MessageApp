import React, { Component } from 'react';

export default class componentName extends Component {
    render() {
        return (
            <header className="header">
                <div className="wrap">
                    <h2 className="logo"><a href="">Website Logo</a></h2>
                    <a id="menu-icon">&#9776; Menu</a>

                    <nav className="navbar">
                        <ul className="menu">
                            <li><a href="#">Belge Yönetimi</a></li>
                            <li><a href="#">Hesap işlemleri</a></li>
                            <li><a href="#">Çıkış</a></li>
                        </ul>
                    </nav>

                </div>
            </header>
        );
    }
}
