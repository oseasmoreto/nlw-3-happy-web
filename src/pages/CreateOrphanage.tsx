import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';

import {FiPlus } from "react-icons/fi";

import '../styles/pages/create-orphanage.css';

import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";

import {LeafletMouseEvent} from 'leaflet';
import api from "../services/api";
import { useHistory } from "react-router-dom";

export default function CreateOrphanage() {
  const [position, setPosition] = useState({latitude: 0, longitude: 0});

  //FORM VARIAVEIS
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const history = useHistory();

  function handleMapClick(event: any){
    const {lat, lng} = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng
    })
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();
    const {latitude, longitude} = position;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('instructions', instructions);
    data.append('open_on_weekends', String(open_on_weekends));
    data.append('opening_hours', opening_hours);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude ));
    
    images.forEach(image =>{
      data.append('images', image);
    })
    
    await api.post('orphanages', data)
    
    alert('Cadastro realizado com sucesso.');

    history.push('/app')
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>){
    if(!event.target.files) return;
    
    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image)
    })

    setPreviewImages(selectedImagesPreview);
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar></Sidebar>

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-21.2852989,-50.3294143]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />
              {position.latitude != 0 && (
                  <Marker 
                  interactive={false} 
                  icon={mapIcon} 
                  position={[position.latitude,position.longitude]} 
                  />
                )
              }
              
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input value={name} onChange={event => setName(event.target.value)} id="name" />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea value={about} onChange={event => setAbout(event.target.value)} id="about" maxLength={300} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map((image) =>{
                  return (
                    <img key={image} src={image} alt="Preview"/>
                  )
                })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>

                <input multiple onChange={handleSelectImages} type="file" id="image[]"/>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea value={instructions} onChange={event => setInstructions(event.target.value)} id="instructions" />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horario de funcionamento</label>
              <input  value={opening_hours} onChange={event => setOpeningHours(event.target.value)} id="opening_hours" />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button type="button" onClick={() => {setOnWeekends(true)}} className={open_on_weekends == true ? 'active' : ''}>Sim</button>
                <button type="button" onClick={() => {setOnWeekends(false)}} className={open_on_weekends == false ? 'active' : ''}>Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
