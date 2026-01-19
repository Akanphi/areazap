export default function ServicesInfoBox() {
    return (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
                🔐 Secure OAuth Connection
            </h3>
            <p className="text-blue-800 text-sm">
                When you click &quot;Connect&quot;, you&apos;ll be redirected to the service&apos;s
                official login page. We never see your password - the service
                provides us with a secure token to perform actions on your behalf.
            </p>
        </div>
    );
}
