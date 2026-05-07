import React from 'react';

const Download: React.FC = () => {
  return (
    <div className="download-page">
      <div className="download-container">
        <div className="download-card">
          <div className="app-icon">
            <img src="/logo2.png" alt="Cantiques FFPM" />
          </div>
          <h1>Cantiques FFPM</h1>
          <p className="version">Version 1.0.0 (Android)</p>
          <p className="description">
            Téléchargez l'application officielle pour accéder à tous vos cantiques préférés même hors ligne.
          </p>
          
          <a href="/apk/cantique.apk" download className="download-button">
            <span className="icon">⬇</span>
            Télécharger l'APK
          </a>
          
          <div className="instructions">
            <h3>Comment installer ?</h3>
            <ul>
              <li>Téléchargez le fichier APK ci-dessus.</li>
              <li>Ouvrez le fichier sur votre téléphone Android.</li>
              <li>Autorisez l'installation de sources inconnues si demandé.</li>
              <li>Lancez l'application et profitez !</li>
            </ul>
          </div>
        </div>
        
        <div className="back-link">
          <a href="/">Retour à l'accueil</a>
        </div>
      </div>
    </div>
  );
};

export default Download;
