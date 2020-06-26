import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await api.get('foods');
      setFoods(response.data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // TODO ADD A NEW FOOD PLATE TO THE API

      const response = await api.post('foods', food);

      setFoods(state => [...state, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  // atualiza o state foods depois do edit
  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    console.log(food);

    try {
      const response = await api.put(`foods/${editingFood.id}`, food);

      const index = foods.indexOf(editingFood);
      const listFood = foods.filter(item => item.id !== editingFood.id);

      listFood.splice(index, 0, response.data);
      setFoods(listFood);
    } catch (err) {
      console.log(err);
    }

    // TODO UPDATE A FOOD PLATE ON THE API
  }

  // apaga da api e atualiza o state
  async function handleDeleteFood(id: number): Promise<void> {
    await api.delete(`foods/${id}`);
    setFoods(state => state.filter(food => food.id !== id));
  }

  // edita o food no modal
  function handleEditFood(food: IFoodPlate): void {
    setEditModalOpen(!editModalOpen);
    setEditingFood(food);

    // TODO SET THE CURRENT EDITING FOOD ID IN THE STATE
  }

  // fecha o add modal
  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  // fecha o edit modal
  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
