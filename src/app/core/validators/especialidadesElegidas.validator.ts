import { AbstractControl, ValidationErrors } from "@angular/forms";


export const especialidadesElegidasValidator = (control:AbstractControl):ValidationErrors | null=>{

    const error = {sinEspecialidad:"especialidadesElegidas"}; 
    const value = control.value;

    if(value.length == 0){
        return error;
    }else{
        return null;
    }
}