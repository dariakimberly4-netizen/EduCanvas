"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdmissionInquiry() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="admissions-section" id="admissions">
      <div className="shell admissions-layout">
        <div>
          <p className="overline">Admissions 2026–27</p>
          <h2>See whether Shapla Grove is right for your child.</h2>
          <p>Tell us which class you are considering. Our admissions team will call you to explain availability, requirements, fees, and the next campus visit.</p>
          <ul><li>No application fee for an initial enquiry</li><li>Response within one school day</li><li>Campus visits available Sunday–Thursday</li></ul>
        </div>
        <form className="inquiry-form" onSubmit={handleSubmit}>
          <div className="form-heading"><h3>Request admission information</h3><p>Fields marked * are required.</p></div>
          <label>Parent or guardian name *<Input name="name" required placeholder="Enter your full name" /></label>
          <label>Phone number *<Input name="phone" type="tel" required placeholder="+880 1XXX XXXXXX" /></label>
          <label>Class you are interested in *
            <select name="classLevel" required defaultValue="">
              <option value="" disabled>Select a class level</option>
              <option>Playgroup–KG</option><option>Classes I–V</option><option>Classes VI–X</option><option>Classes XI–XII</option>
            </select>
          </label>
          <Button className="button button-primary" type="submit">{sent ? "Enquiry received" : "Request a call from admissions"}</Button>
          <small>{sent ? "Our admissions office will contact you within one school day." : "By continuing, you agree that our admissions office may contact you about this enquiry."}</small>
        </form>
      </div>
    </section>
  );
}
