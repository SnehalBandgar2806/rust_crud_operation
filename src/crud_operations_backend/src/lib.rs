use candid::{CandidType, Deserialize};
use ic_cdk::{update, query};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Deserialize, Clone)]
pub struct Variable {
    pub id: u64,
    pub name: String,
    pub value: String,
}

thread_local! {
    static VARIABLES: RefCell<HashMap<u64, Variable>> = RefCell::new(HashMap::new());
    static COUNTER: RefCell<u64> = RefCell::new(0);
}

#[update]
fn create_variable(name: String, value: String) -> Variable {
    COUNTER.with(|c| {
        let mut count = c.borrow_mut();
        *count += 1;
        let id = *count;
        let var = Variable { id, name, value };
        VARIABLES.with(|vars| {
            vars.borrow_mut().insert(id, var.clone());
        });
        var
    })
}

#[query]
fn get_all_variables() -> Vec<Variable> {
    VARIABLES.with(|vars| vars.borrow().values().cloned().collect())
}

#[update]
fn update_variable(id: u64, new_value: String) -> Option<Variable> {
    VARIABLES.with(|vars| {
        let mut map = vars.borrow_mut();
        if let Some(var) = map.get_mut(&id) {
            var.value = new_value;
            return Some(var.clone());
        }
        None
    })
}

#[update]
fn delete_variable(id: u64) -> bool {
    VARIABLES.with(|vars| vars.borrow_mut().remove(&id).is_some())
}

#[cfg(test)]
mod tests {
    use super::*;
    use candid::export_service;

    #[test]
    fn export_did() {
        export_service!();
        std::fs::write("crud_operations_backend.did", __export_service())
            .expect("Write failed");
    }
}
