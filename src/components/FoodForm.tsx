import { useForm } from "react-hook-form";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { createFood, updateFood } from "../api/foods";
import { showServerErrors } from "../utils/formErrors";
import { foodCategories } from "../utils/options";
import type { FoodItemProps, FoodData, FoodFormProps } from "../types/track";
import type { ApiError } from "../types/common";

function FoodForm({food,onDone}:FoodFormProps) {

    const {register, handleSubmit, setError, formState:{errors}}=useForm<FoodData>({
        defaultValues:food?{
            name:food.name,
            category:food.category,
            servingDescription:food.servingDescription,
            caloriesPerServing:food.caloriesPerServing
        }:{
            category: foodCategories[0].value 
        }
    })

    const queryClient = useQueryClient();

    const mutation = useMutation<FoodItemProps,ApiError,FoodData>({
        mutationFn:(data)=>food?updateFood(food.id,data):createFood(data),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["foods"]});
            onDone();
        },
        onError:(error)=>showServerErrors(error,setError)
    })

    return (
        <>
        <form onSubmit={handleSubmit((data)=>mutation.mutate(data))}>
            <h3>{food?"עריכת מאכל":"מאכל חדש"}</h3>
            <label> שם
                <input type="text" {...register("name", {
                    required: "שדה חובה",
                    minLength: { value: 2, message: "לפחות 2 תווים" },
                    maxLength: { value: 60, message: "עד 60 תווים" }
                })} />
                {errors.name&&<p>{errors.name.message}</p>}
            </label>
            <label>קטגוריה
                <select {...register("category",{required:"שדה חובה"})}>
                    {foodCategories.map((c)=>(
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </label>
            <label>תיאור
                <input type="text" {...register("servingDescription", {
                    required: "שדה חובה",
                    maxLength: { value: 60, message: "עד 60 תווים" }
                })} />
                {errors.servingDescription&&<p>{errors.servingDescription.message}</p>}
            </label>
            <label>קלוריות למנה
                <input type="number" {...register("caloriesPerServing", {
                    required: "שדה חובה",
                    valueAsNumber: true,
                    min: { value: 0, message: "לא יכול להיות שלילי" },
                    max: { value: 2000, message: "עד 2000" }
                })} />
                {errors.caloriesPerServing&&<p>{errors.caloriesPerServing.message}</p>}
            </label>
            {errors.root&&<p>{errors.root.message}</p>}
            <button type="submit" disabled={mutation.isPending}>שליחה</button>
        </form>
        </>
    );
}

export default FoodForm;
