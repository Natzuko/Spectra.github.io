# SPECTRA — NASA EPIC Earth Visualization

> Obra audiovisual generativa en tiempo real que utiliza los datos del satélite **EPIC** de la **NASA** para construir un *atlas vivo del cielo*.

## 🛰️ Sobre el Proyecto

**SPECTRA** transforma la ausencia de datos durante el *shutdown* gubernamental de EE.UU. en una experiencia visual y conceptual.  
A partir de la API del instrumento **EPIC** del satélite **DSCOVR**, la obra revela un cielo intervenido por tecnologías de observación, simulación y control, proponiendo una mirada crítica y poética sobre cómo percibimos y representamos la atmósfera en la era de la inteligencia artificial.  

Lejos de la contemplación pasiva, el cielo se convierte en un territorio vivo, inestable y en permanente reescritura algorítmica.  
La arquitectura del sistema integra un entorno web con **TouchDesigner**, conectado mediante **WebSocket**, lo que permite la transmisión de datos y visualizaciones en tiempo real entre el navegador y el entorno audiovisual.

## 🎨 Características

- **Visualización en tiempo real** de imágenes EPIC de la NASA  
- **Conexión WebSocket** entre frontend y TouchDesigner  
- **Sistema de fallback inteligente** para periodos de indisponibilidad de datos  
- **Interfaz de diagnóstico** con actualización dinámica de estado  
- **Modo demo** basado en datos simulados y material de archivo  

## 🚀 Tecnologías

- HTML5, CSS3, JavaScript (ES6+)  
- **WebSocket** para conexión en tiempo real con **TouchDesigner**  
- NASA EPIC API  
- Google Fonts *(Montserrat)*  
- Diseño adaptable con CSS Grid y Flexbox  

## 📡 Fuente de Datos

- **API Principal:** [NASA EPIC (Earth Polychromatic Imaging Camera)](https://epic.gsfc.nasa.gov/)  
- **Satélite:** DSCOVR *(Deep Space Climate Observatory)*  
- **Fallback:** Datos simulados durante periodos de inaccesibilidad o shutdown  

## 🎯 Paleta de Colores

- `#040412` — deep-space  
- `#1D2833` — dark-slate  
- `#C6CBC9` — silver-mist  
- `#D4E5DE` — mint-frost  
- `#12A7B8` — aqua-cyan  

## 👩‍💻 **Natalia Scuzarello**  
[www.natscuzarello.com](https://www.natscuzarello.com)

---

*Desarrollado durante el shutdown gubernamental de EE.UU. de 2025.*  
*SPECTRA explora la relación entre tecnología, percepción y archivos celestes mediante la integración de datos científicos y lenguajes audiovisuales generativos.*
