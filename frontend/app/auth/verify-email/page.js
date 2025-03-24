"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { resendVerificationEmail, verifyOTP, updatePhone } from "@/lib/api"
import BackgroundAnimation from "@/components/background-animation"
import { CheckCircle, AlertCircle, ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react"

export default function VerifyOTPPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""
    const role = searchParams.get("userType") || ""
    const phone = searchParams.get("phone") || ""
    const userType = searchParams.get("userType") || "donor"

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [verificationStatus, setVerificationStatus] = useState("pending")
    const [countdown, setCountdown] = useState(60)
    const [isResending, setIsResending] = useState(false)
    const [resendStatus, setResendStatus] = useState(null)
    const [showChangePhone, setShowChangePhone] = useState(false)
    const [newPhone, setNewPhone] = useState("")
    const [error, setError] = useState("")

    const inputRefs = useRef([])

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus()
        }
    }, [])

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
            inputRefs.current[index + 1].focus()
        }

        if (value && index === 5 && newOtp.every((digit) => digit)) {
            verifyOtpCode(newOtp.join(""))
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text/plain").trim()

        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split("")
            setOtp(digits)

            inputRefs.current[5].focus()

            verifyOtpCode(pastedData)
        }
    }

    const verifyOtpCode = async (otpCode) => {
        setError("")

        try {
            const response = await verifyOTP(otpCode, email, role)
            setVerificationStatus("success")
            setTimeout(() => {
                router.push(`/auth/login`)
            }, 2000)
        } catch (err) {
            setError(err.message || "Invalid OTP. Please try again.")
        }
    }

    const handleResendOTP = async () => {
        setIsResending(true)
        setResendStatus(null)
        setError("")

        try {
            await resendVerificationEmail(email, phone, role)
            setResendStatus("success")
            setCountdown(60)
            setOtp(["", "", "", "", "", ""])
            inputRefs.current[0].focus()
        } catch (err) {
            setResendStatus("error")
            setError(err.message || "Failed to resend OTP. Please try again.")
        } finally {
            setIsResending(false)
        }
    }

    // const handleChangePhone = async (e) => {
    //     e.preventDefault()
    //     setError("")

    //     if (!newPhone.trim()) {
    //         setError("Please enter a valid phone number")
    //         return
    //     }
    //     try {
    //         await updatePhone(email, newPhone)
    //         router.push(
    //             `/auth/verify-otp?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(newPhone)}&userType=${userType}`,
    //         )
    //     } catch (err) {
    //         setError(err.message || "Failed to update phone number. Please try again.")
    //     }
    // }

    // If verification is successful
    if (verificationStatus === "success") {
        return (
            <div className="min-h-screen flex flex-col">
                <BackgroundAnimation />
                <div className="flex-grow flex items-center justify-center p-4">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-lg shadow-md p-8 border text-center">
                            <div className="flex justify-center mb-6">
                                <CheckCircle className="h-16 w-16 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Verification Successful!</h2>
                            <p className="text-gray-600 mb-6">
                                Your account has been verified successfully. You will be redirected to your Login shortly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Default view - OTP verification
    return (
        <div className="min-h-screen flex flex-col">
            <BackgroundAnimation />
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-md p-8 border">
                        <div className="text-center mb-6">
                            <Link href="/" className="inline-block">
                                <h1 className="text-2xl font-bold text-blue-600">Samarthan Kriya</h1>
                            </Link>
                        </div>

                        <div className="flex justify-center mb-6">
                            <div className="bg-blue-100 p-4 rounded-full">
                                <ShieldCheck className="h-12 w-12 text-blue-600" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-center mb-2">Verify Your Account</h2>
                        <p className="text-gray-600 text-center mb-6">
                            We've sent a 6-digit OTP to your {phone ? "phone" : "email"}{" "}
                            <span className="font-medium">{phone || email}</span>. Please enter the code below to verify your account.
                        </p>

                        {error && (
                            <Alert className="mb-4 bg-red-50 border-red-200 flex gap-3 justify-start items-center">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <AlertDescription className="text-red-700">{error}</AlertDescription>
                            </Alert>
                        )}

                        {resendStatus === "success" && (
                            <Alert className="mb-4 bg-green-50 border-green-200 flex gap-3 justify-start items-center">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <AlertDescription className="text-green-700">
                                    OTP has been resent successfully. Please check your {phone ? "phone" : "email"}.
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="mb-6">
                            <Label htmlFor="otp-input" className="sr-only">
                                Enter OTP
                            </Label>
                            <div className="flex justify-between gap-2" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-xl font-bold border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* {showChangePhone ? (
                            <form onSubmit={handleChangePhone} className="space-y-4 mb-6">
                                <div className="space-y-2">
                                    <Label htmlFor="newPhone">New Phone Number</Label>
                                    <Input
                                        id="newPhone"
                                        type="tel"
                                        value={newPhone}
                                        onChange={(e) => setNewPhone(e.target.value)}
                                        placeholder="Enter your new phone number"
                                        required
                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                                        Update Phone
                                    </Button>
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowChangePhone(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                        
                        )} */}

                        <div className="space-y-4 mb-6">
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 text-white"
                                onClick={handleResendOTP}
                                disabled={isResending || countdown > 0}
                            >
                                <RefreshCw className="h-4 w-4" />
                                {isResending ? "Sending..." : countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                            </Button>
                            {phone && (
                                <Button variant="outline" className="w-full" onClick={() => setShowChangePhone(true)}>
                                    Change Phone Number
                                </Button>
                            )}
                        </div>

                        <div className="text-center">
                            <Link href="/auth/register" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Registration
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

