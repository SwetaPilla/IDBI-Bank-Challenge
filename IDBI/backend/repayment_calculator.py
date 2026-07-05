#!/usr/bin/env python3
"""
IDBI Smart Lending Copilot - AI Repayment Capacity & Explainability Engine
This script demonstrates the calculation logic for evaluating a customer's monthly
disposable income, maximum safe EMI limit, and generating explainability metrics.
"""

class RepaymentCapacityEngine:
    def __init__(self, buffer_margin=0.70):
        # Default safety margin: 70% of disposable income can go to EMI, 30% kept as reserve
        self.buffer_margin = buffer_margin

    def calculate_capacity(self, financial_data):
        """
        Calculates disposable income and eligibility.
        financial_data contains:
          - salary_credits: float
          - business_turnover: float (optional)
          - rental_income: float (optional)
          - existing_emis: float
          - lifestyle_spends: float
          - utilities_and_bills: float
          - investment_sips: float
        """
        # 1. Total Inflows
        salary = financial_data.get('salary_credits', 0.0)
        business = financial_data.get('business_turnover', 0.0)
        rent_inflow = financial_data.get('rental_income', 0.0)
        
        # In banking, business turnover and rent inflows have haircut factors applied for risk mitigation
        adjusted_business = business * 0.15  # Estimate 15% net profit margin from business turnover
        adjusted_rent = rent_inflow * 0.80    # Apply 20% haircut for vacancy and maintenance
        
        total_monthly_inflow = salary + adjusted_business + adjusted_rent

        # 2. Total Outflows (Obligations)
        existing_emis = financial_data.get('existing_emis', 0.0)
        utilities = financial_data.get('utilities_and_bills', 0.0)
        lifestyle = financial_data.get('lifestyle_spends', 0.0)
        investments = financial_data.get('investment_sips', 0.0) # SIPs are investments, but impact short-term liquidity

        total_mandatory_outflow = existing_emis + utilities
        total_estimated_outflow = total_mandatory_outflow + lifestyle + investments

        # 3. Calculations
        disposable_income = total_monthly_inflow - total_estimated_outflow
        if disposable_income < 0:
            disposable_income = 0.0

        # Maximum Safe EMI based on buffer margin
        max_safe_emi = disposable_income * self.buffer_margin
        
        # Debt-to-Income (DTI) ratio
        dti_ratio = (existing_emis / total_monthly_inflow) if total_monthly_inflow > 0 else 1.0

        # Loan Eligibility Range (Assuming interest rate of 10.5% p.a., tenure 5 years)
        # EMI formula: P = (E * ((1+r)^n - 1)) / (r * (1+r)^n)
        r = 10.5 / 12 / 100
        n = 5 * 12
        max_loan_limit = 0.0
        if max_safe_emi > 0:
            max_loan_limit = max_safe_emi * (((1 + r)**n - 1) / (r * (1 + r)**n))
            max_loan_limit = round(max_loan_limit / 50000) * 50000 # Round to nearest 50,000

        # Risk Rating assignment
        if dti_ratio > 0.50 or max_safe_emi <= 0:
            risk_rating = "HIGH"
        elif dti_ratio > 0.35:
            risk_rating = "MEDIUM"
        else:
            risk_rating = "LOW"

        # 4. Generate Explainability Metrics (Module 9)
        explainability_narrative = (
            f"Customer has a verified monthly inflow of ₹{total_monthly_inflow:,.2f} "
            f"(comprising Salary: ₹{salary:,.2f}, Adjusted Rental: ₹{adjusted_rent:,.2f}, "
            f"Adjusted Business: ₹{adjusted_business:,.2f}). Total monthly commitments "
            f"stand at ₹{total_estimated_outflow:,.2f}, which includes existing EMIs of ₹{existing_emis:,.2f} "
            f"and lifestyle/utility expenses of ₹{utilities + lifestyle:,.2f}. "
            f"This leaves a liquid disposable buffer of ₹{disposable_income:,.2f}. "
            f"Applying a safety buffer of {int(self.buffer_margin * 100)}%, the maximum safe monthly "
            f"installment (EMI) the customer can handle is ₹{max_safe_emi:,.2f}. "
            f"The Debt-to-Income (DTI) ratio is {dti_ratio:.1%}, representing a '{risk_rating}' risk profile."
        )

        return {
            "TotalMonthlyInflow": total_monthly_inflow,
            "DisposableIncome": disposable_income,
            "MaxSafeEMI": max_safe_emi,
            "LoanEligibilityLimit": max_loan_limit,
            "DTIRatio": dti_ratio,
            "RiskRating": risk_rating,
            "Explainability": explainability_narrative
        }

if __name__ == "__main__":
    # Test case: Sample customer Rahul
    customer_data = {
        'salary_credits': 85000.0,
        'rental_income': 15000.0,
        'existing_emis': 12000.0,
        'utilities_and_bills': 8000.0,
        'lifestyle_spends': 15000.0,
        'investment_sips': 5000.0
    }

    engine = RepaymentCapacityEngine()
    result = engine.calculate_capacity(customer_data)
    
    print("--- IDBI AI REPAYMENT CAPACITY COMPUTATION ---")
    print(f"Total Monthly Inflow:  ₹{result['TotalMonthlyInflow']:,.2f}")
    print(f"Disposable Income:     ₹{result['DisposableIncome']:,.2f}")
    print(f"Maximum Safe EMI Limit: ₹{result['MaxSafeEMI']:,.2f}")
    print(f"Max Loan Eligibility:  ₹{result['LoanEligibilityLimit']:,.2f}")
    print(f"DTI Ratio:             {result['DTIRatio']:.1%}")
    print(f"Risk Rating:           {result['RiskRating']}")
    print("\n--- EXPLAINABLE REASONING FOR CREDIT SANCTION ---")
    print(result['Explainability'])
